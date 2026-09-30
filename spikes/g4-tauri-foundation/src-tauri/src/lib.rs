#[cfg(all(feature = "sqlcipher-spike", test))]
mod portable_backup;
mod storage;

use serde::Deserialize;
use tauri::{AppHandle, Manager, State};

#[derive(Debug, Clone, Copy)]
enum Role {
    Administrator,
}

struct AuthorizationContext {
    actor_id: String,
    role: Role,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CreatePatientInput {
    display_name: String,
}

fn authorize_patient_access(context: &AuthorizationContext) -> Result<(), String> {
    if context.actor_id.trim().is_empty() {
        return Err("acesso negado: sessão sem ator".to_owned());
    }
    match context.role {
        Role::Administrator => Ok(()),
    }
}

fn app_data_dir(app: &AppHandle) -> Result<std::path::PathBuf, String> {
    app.path()
        .app_data_dir()
        .map_err(|error| format!("não foi possível resolver o diretório privado do app: {error}"))
}

#[tauri::command]
async fn create_test_patient(
    app: AppHandle,
    authorization: State<'_, AuthorizationContext>,
    input: CreatePatientInput,
) -> Result<storage::Patient, String> {
    authorize_patient_access(&authorization)?;
    let database = storage::database_path(&app_data_dir(&app)?);
    tauri::async_runtime::spawn_blocking(move || {
        storage::create_patient(&database, input.display_name)
    })
    .await
    .map_err(|error| format!("a tarefa de persistência foi interrompida: {error}"))?
}

#[tauri::command]
async fn list_test_patients(
    app: AppHandle,
    authorization: State<'_, AuthorizationContext>,
) -> Result<Vec<storage::Patient>, String> {
    authorize_patient_access(&authorization)?;
    let database = storage::database_path(&app_data_dir(&app)?);
    tauri::async_runtime::spawn_blocking(move || storage::list_patients(&database))
        .await
        .map_err(|error| format!("a tarefa de persistência foi interrompida: {error}"))?
}

#[tauri::command]
async fn get_storage_status(
    app: AppHandle,
    authorization: State<'_, AuthorizationContext>,
) -> Result<storage::StorageStatus, String> {
    authorize_patient_access(&authorization)?;
    let database = storage::database_path(&app_data_dir(&app)?);
    tauri::async_runtime::spawn_blocking(move || storage::storage_status(&database))
        .await
        .map_err(|error| format!("a tarefa de persistência foi interrompida: {error}"))?
}

#[tauri::command]
async fn create_and_verify_backup(
    app: AppHandle,
    authorization: State<'_, AuthorizationContext>,
) -> Result<storage::BackupVerification, String> {
    authorize_patient_access(&authorization)?;
    let app_data = app_data_dir(&app)?;
    let database = storage::database_path(&app_data);
    let backup_dir = app_data.join("backups");
    tauri::async_runtime::spawn_blocking(move || storage::backup_and_verify(&database, &backup_dir))
        .await
        .map_err(|error| format!("a tarefa de backup foi interrompida: {error}"))?
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(AuthorizationContext {
            actor_id: "spike-admin".to_owned(),
            role: Role::Administrator,
        })
        .setup(|app| {
            #[cfg(desktop)]
            app.handle()
                .plugin(tauri_plugin_updater::Builder::new().build())
                .map_err(|error| format!("inicialização do updater falhou: {error}"))?;
            let app_data = app
                .path()
                .app_data_dir()
                .map_err(|error| format!("app data dir indisponível: {error}"))?;
            storage::initialize_database(&storage::database_path(&app_data))
                .map_err(|error| format!("inicialização do banco falhou: {error}"))?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            create_test_patient,
            list_test_patients,
            get_storage_status,
            create_and_verify_backup
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn authorization_rejects_missing_actor() {
        let context = AuthorizationContext {
            actor_id: " ".to_owned(),
            role: Role::Administrator,
        };

        assert!(authorize_patient_access(&context).is_err());
    }
}
