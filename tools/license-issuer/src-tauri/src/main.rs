#[path = "../../../../src-tauri/src/security.rs"]
// Shared audited DPAPI/KDF code; clinical authentication and lock helpers are intentionally unused here.
#[allow(dead_code)]
mod security;
mod vault;
use serde::Serialize;
use tauri::Manager;
pub type Result<T> = std::result::Result<T, Error>;
#[derive(Debug, Serialize)]
pub struct Error {
    message: String,
}
impl Error {
    pub fn internal() -> Self {
        Self::validation("Não foi possível concluir. Verifique o arquivo e tente novamente.")
    }
    pub fn validation(message: &str) -> Self {
        Self {
            message: message.to_owned(),
        }
    }
}
impl From<std::io::Error> for Error {
    fn from(_: std::io::Error) -> Self {
        Self::internal()
    }
}
impl From<rusqlite::Error> for Error {
    fn from(_: rusqlite::Error) -> Self {
        Self::internal()
    }
}
impl From<serde_json::Error> for Error {
    fn from(_: serde_json::Error) -> Self {
        Self::validation("Formato inválido.")
    }
}
#[tauri::command]
fn issuer_operate(
    state: tauri::State<'_, std::sync::Mutex<vault::Vault>>,
    action: vault::Action,
) -> Result<serde_json::Value> {
    state.lock().map_err(|_| Error::internal())?.execute(action)
}
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            let vault = vault::Vault::open(app.path().app_local_data_dir()?)
                .map_err(|_| std::io::Error::other("Cofre do emissor indisponível."))?;
            app.manage(std::sync::Mutex::new(vault));
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![issuer_operate])
        .run(tauri::generate_context!())
        .expect("Não foi possível abrir o emissor.");
}
