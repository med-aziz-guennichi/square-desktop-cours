use mac_address::get_mac_address;
use tauri_plugin_dialog;
use tauri_plugin_process;
use tauri_plugin_updater;
use tauri_plugin_prevent_default::Flags;
use muda::{MenuItem, PredefinedMenuItem, Submenu};
use muda::accelerator::{Accelerator, Modifiers, Code};
use muda::Menu;

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
    let menu = Menu::new();

    let menu_item2 = MenuItem::new("Menu item #2", false, None);
    let submenu = Submenu::with_items(
        "Submenu Outer".to_string(),
        true,
        &[
            &MenuItem::new(
                "Menu item #1",
                true,
                Some(Accelerator::new(Some(Modifiers::ALT), Code::KeyD)),
            ),
            &PredefinedMenuItem::separator(),
            &menu_item2,
            &MenuItem::new("Menu item #3", true, None),
            &PredefinedMenuItem::separator(),
            &Submenu::with_items(
                "Submenu Inner".to_string(),
                true,
                &[
                    &MenuItem::new("Submenu item #1", true, None),
                    &PredefinedMenuItem::separator(),
                    &menu_item2,
                ],
            )
            .expect("Failed to create inner submenu"),
        ],
    )
    .expect("Failed to create outer submenu");

    menu.append(&submenu).expect("Failed to append submenu");

    tauri::Builder::default()
        .setup(|_| {
            #[cfg(target_os = "windows")]
            {
                let window = tauri::Window::current("main").expect("Failed to get main window");
                unsafe {
                    menu.init_for_hwnd(window.hwnd() as isize);
                }
            }
            Ok(())
        })
        .plugin(tauri_plugin_prevent_default::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_process::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            get_mac,
            enable_protection,
            disable_protection
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}