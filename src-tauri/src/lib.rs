use mac_address::get_mac_address;
use std::env::temp_dir;
use std::{path::PathBuf, process::Command};
use tauri::path::PathResolver;
use tauri::{AppHandle, Manager};
use tauri_plugin_dialog;
use tauri_plugin_process;
use tauri_plugin_updater;

#[tauri::command]
fn get_mac() -> Result<String, String> {
    match get_mac_address() {
        Ok(Some(ma)) => Ok(ma.to_string()),
        Ok(None) => Err("MAC address not found".into()),
        Err(e) => Err(format!("Failed to get MAC address: {}", e)),
    }
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn enable_protection(window: tauri::Window) {
    #[cfg(any(target_os = "windows", target_os = "macos", target_os = "linux"))]
    if let Err(e) = window.set_decorations(false) {
        eprintln!("Failed to disable decorations: {}", e);
    }

    if let Err(e) = window.set_always_on_top(true) {
        eprintln!("Failed to set always on top: {}", e);
    }

    // Additional protection measures
    if let Err(e) = window.set_content_protected(true) {
        eprintln!("Failed to enable content protection: {}", e);
    }
}

#[tauri::command]
fn disable_protection(window: tauri::Window) {
    #[cfg(any(target_os = "windows", target_os = "macos", target_os = "linux"))]
    if let Err(e) = window.set_decorations(true) {
        eprintln!("Failed to enable decorations: {}", e);
    }

    if let Err(e) = window.set_always_on_top(false) {
        eprintln!("Failed to disable always on top: {}", e);
    }

    if let Err(e) = window.set_content_protected(false) {
        eprintln!("Failed to disable content protection: {}", e);
    }
}

#[tauri::command]
fn resize_video(input_path: String, width: u32, height: u32) -> Result<String, String> {
    // 1. Verify input file
    let input_meta =
        std::fs::metadata(&input_path).map_err(|e| format!("Input file error: {}", e))?;

    // Set the new size limit to 2GB (2 * 1024 * 1024 * 1024 bytes)
    if input_meta.len() > 2_147_483_648 {
        return Err("File too large (max 2GB)".into());
    }

    // 2. Create output path
    let output_path = temp_dir().join(format!("resized_{}.mp4", uuid::Uuid::new_v4()));

    // 3. Build FFmpeg command for resizing to 360p
    let mut cmd = Command::new("ffmpeg");
    cmd.args(["-i", &input_path])
        .args([
            "-vf",
            &format!(
                "scale=ceil({}/2)*2:ceil({}/2)*2:force_original_aspect_ratio=decrease",
                width, height
            ),
        ])
        // Use libx264 for better quality (CRF value for high quality)
        .args([
            "-c:v", "libx264",
            "-preset", "fast",
            "-crf", "23", // Adjust CRF for better quality (lower = better quality, 23 is default)
        ])
        // Use aac audio codec with reasonable bitrate
        .args([
            "-c:a", "aac",
            "-b:a", "192k",
            "-movflags", "+faststart", // Fast start for web playback
            "-y",
        ])
        .arg(output_path.to_str().unwrap()); // No quotes around the path

    // 4. Execute with timeout
    let mut child = cmd
        .spawn()
        .map_err(|e| format!("Failed to spawn ffmpeg: {}", e))?;

    let start = std::time::Instant::now();
    let timeout = std::time::Duration::from_secs(300); // 5 minute timeout

    loop {
        match child.try_wait() {
            Ok(Some(status)) => {
                if !status.success() {
                    return Err("FFmpeg processing failed".into());
                }
                break;
            }
            Ok(None) => {
                if start.elapsed() > timeout {
                    let _ = child.kill();
                    return Err("Processing timed out".into());
                }
                std::thread::sleep(std::time::Duration::from_millis(100));
            }
            Err(e) => return Err(format!("Error waiting for ffmpeg: {}", e)),
        }
    }

    // 5. Verify output and size check
    if !output_path.exists() {
        return Err("Output file not created".into());
    }

    let output_meta = std::fs::metadata(&output_path).map_err(|e| format!("Output file error: {}", e))?;
    
    if output_meta.len() > 2_147_483_648 {
        return Err("Output file exceeds 2GB limit".into());
    }

    Ok(output_path.to_string_lossy().to_string())
}



#[tauri::command]
fn get_file_path(app: AppHandle, file_name: String) -> Result<String, String> {
    // Get the app data directory, which is an Option<PathBuf>
    let base_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    let mut full_path = PathBuf::from(base_dir);
    full_path.push("uploads");

    // Create the 'uploads' directory if it doesn't exist
    std::fs::create_dir_all(&full_path).map_err(|e| e.to_string())?;

    // Append the file name
    full_path.push(file_name);

    Ok(full_path.to_string_lossy().to_string())
}

#[tauri::command]
async fn save_uploaded_file(
    app: AppHandle,
    file: Vec<u8>,
    file_name: String,
) -> Result<String, String> {
    let uploads_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?
        .join("uploads");

    // Create directory if needed
    tokio::fs::create_dir_all(&uploads_dir)
        .await
        .map_err(|e| e.to_string())?;

    let file_path = uploads_dir.join(file_name);

    // Save the file
    tokio::fs::write(&file_path, file)
        .await
        .map_err(|e| e.to_string())?;

    Ok(file_path.to_string_lossy().to_string())
}

#[tauri::command]
fn read_resized_file(path: String) -> Result<Vec<u8>, String> {
    std::fs::read(&path).map_err(|e| format!("Failed to read file: {}", e))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // Setup updater plugin
        .setup(|app| {
            #[cfg(desktop)]
            {
                // Initialize the updater plugin in your app.
                app.handle()
                    .plugin(tauri_plugin_updater::Builder::new().build())?;
            }
            Ok(())
        })
        // Initialize dialog plugin for any dialogs you need (like confirmations, alerts)
        .plugin(tauri_plugin_dialog::init())
        // Initialize process plugin to run external processes if needed
        .plugin(tauri_plugin_process::init())
        // Add commands like greet and get_mac
        .invoke_handler(tauri::generate_handler![
            greet,
            get_mac,
            enable_protection,
            disable_protection,
            resize_video,
            save_uploaded_file,
            get_file_path,
            read_resized_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
