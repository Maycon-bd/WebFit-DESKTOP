mod acceptance_tests;
mod admin;
#[cfg(test)]
mod admin_tests;
// One implementation for the integrated panel and the historical issuer tool.
#[cfg(test)]
mod audit_recovery_tests;
mod branding;
mod dashboard;
mod database;
mod energy;
#[path = "../../tools/license-issuer/src-tauri/src/vault.rs"]
mod issuer_vault;
mod license;
mod license_tests;
mod nutrition;
#[cfg(test)]
mod patient_tests;
mod recovery;
mod security;
mod service;
mod tests;
mod update;

use serde::Serialize;
use std::sync::Mutex;
use tauri::{Emitter, Manager};
pub type Result<T> = std::result::Result<T, Error>;
#[derive(Debug, Serialize)]
pub struct Error {
    code: &'static str,
    message: String,
}
impl Error {
    pub fn validation(message: &str) -> Self {
        Self {
            code: "VALIDATION",
            message: message.to_owned(),
        }
    }
    pub fn internal() -> Self {
        Self {
            code: "STORAGE",
            message: "Não foi possível concluir. Seus dados foram preservados; tente novamente."
                .into(),
        }
    }
    pub fn denied() -> Self {
        Self {
            code: "UNAUTHORIZED",
            message: "Entre novamente para continuar.".into(),
        }
    }
}
impl From<rusqlite::Error> for Error {
    fn from(_: rusqlite::Error) -> Self {
        Self::internal()
    }
}
impl From<std::io::Error> for Error {
    fn from(_: std::io::Error) -> Self {
        Self::internal()
    }
}
impl From<serde_json::Error> for Error {
    fn from(_: serde_json::Error) -> Self {
        Self::validation("Formato inválido. Confira os dados informados.")
    }
}

#[tauri::command]
async fn operate(
    state: tauri::State<'_, Mutex<service::Service>>,
    request: service::Command,
) -> Result<serde_json::Value> {
    state
        .lock()
        .map_err(|_| Error::internal())?
        .execute(request)
}
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .setup(|app| {
            if let Some(window) = app.get_webview_window("main") {
                branding::set_taskbar_icon(window.hwnd()?.0)?;
            }
            let root = app.path().app_local_data_dir()?;
            let service = service::Service::open(root).map_err(|_| {
                std::io::Error::other("Não foi possível preparar o armazenamento local.")
            })?;
            app.manage(Mutex::new(service));
            let handle = app.handle().clone();
            std::thread::spawn(move || loop {
                std::thread::sleep(std::time::Duration::from_secs(2));
                if security::windows_locked() {
                    if let Some(state) = handle.try_state::<Mutex<service::Service>>() {
                        if let Ok(mut service) = state.lock() {
                            service.lock();
                            let _ = handle.emit("session-locked", ());
                        }
                    }
                }
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            operate,
            update::check_update,
            update::install_update
        ])
        .run(tauri::generate_context!())
        .expect("Falha ao iniciar WebFit Desktop.");
}
