#![allow(unused)]
#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]
use tauri::Manager;
use window_vibrancy::{apply_blur, apply_vibrancy, NSVisualEffectMaterial};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_os::init())
    .plugin(tauri_plugin_fs::init())
    .plugin(tauri_plugin_sql::Builder::default().build())
    .setup(|app| {
      let window = app.get_webview_window("main").unwrap();

      // #[cfg(target_os = "macos")]
      // apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, Some(16.0))
      //   .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");
      //
      // #[cfg(target_os = "windows")]
      // apply_blur(&window, Some((18, 18, 18, 125)))
      //   .expect("Unsupported platform! 'apply_blur' is only supported on Windows");

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
