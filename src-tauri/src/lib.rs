// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
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
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, get_mac])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
