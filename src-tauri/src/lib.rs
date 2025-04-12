use tauri_plugin_updater;
use tauri_plugin_dialog;
use tauri_plugin_process;
use mac_address::get_mac_address;

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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // Setup updater plugin
        .setup(|app| {
            #[cfg(desktop)]
            {
                // Initialize the updater plugin in your app.
                app.handle().plugin(tauri_plugin_updater::Builder::new().build())?;
            }
            Ok(())
        })
        // Initialize dialog plugin for any dialogs you need (like confirmations, alerts)
        .plugin(tauri_plugin_dialog::init())
        // Initialize process plugin to run external processes if needed
        .plugin(tauri_plugin_process::init())
        // Add commands like greet and get_mac
        .invoke_handler(tauri::generate_handler![greet, get_mac])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
