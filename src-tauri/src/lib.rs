use mac_address::get_mac_address;
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
            disable_protection
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
