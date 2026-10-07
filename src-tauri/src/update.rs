use crate::{service::Service, Error, Result};
use serde_json::{json, Value};
use std::{sync::Mutex, time::Duration};
use tauri::{Emitter, Manager};
use tauri_plugin_updater::UpdaterExt;

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn only_matching_pilot_github_installer_is_trusted() {
        let version = "0.1.6-pilot.1.1";
        let url = "https://github.com/Maycon-bd/webfit-desktop-releases/releases/download/pilot-v0.1.6-pilot.1.1/setup.exe";
        assert!(trusted_download(version, &tauri::Url::parse(url).unwrap()));
        for value in [
            url.replace("https:", "http:"),
            url.replace("github.com", "example.invalid"),
            url.replace("Maycon-bd", "other"),
            url.replace("setup.exe", "setup.msi"),
            url.replace("pilot.1.1", "pilot.2.1"),
            url.replace("github.com", "user:pass@github.com"),
        ] {
            assert!(!trusted_download(
                version,
                &tauri::Url::parse(&value).unwrap()
            ));
        }
    }
}

fn update_error() -> Error {
    Error::validation("Não foi possível concluir a atualização. Tente novamente mais tarde; se o instalador abriu, confira a versão após reiniciar o WebFit.")
}

fn trusted(update: &tauri_plugin_updater::Update) -> bool {
    trusted_download(&update.version, &update.download_url)
}
fn trusted_download(version: &str, url: &tauri::Url) -> bool {
    url.scheme() == "https"
        && url.host_str() == Some("github.com")
        && url.username().is_empty()
        && url.password().is_none()
        && url.port().is_none()
        && url.path().starts_with(&format!(
            "/Maycon-bd/webfit-desktop-releases/releases/download/pilot-v{version}/"
        ))
        && url.path().ends_with(".exe")
        && version.contains("-pilot.")
}

#[tauri::command]
pub async fn check_update(app: tauri::AppHandle, token: String) -> Result<Value> {
    app.state::<Mutex<Service>>()
        .lock()
        .map_err(|_| Error::internal())?
        .authorize_update(&token)?;
    let updater = app
        .updater_builder()
        .timeout(Duration::from_secs(15))
        .build()
        .map_err(|_| update_error())?;
    let update = updater.check().await.map_err(|_| update_error())?;
    match update {
        Some(update) if trusted(&update) => {
            Ok(json!({"version":update.version,"notes":update.body.unwrap_or_default()}))
        }
        Some(_) => Err(update_error()),
        None => Ok(Value::Null),
    }
}

#[tauri::command]
pub async fn install_update(app: tauri::AppHandle, token: String, version: String) -> Result<()> {
    // The version is the one explicitly confirmed by the user, not a URL supplied by the WebView.
    app.state::<Mutex<Service>>()
        .lock()
        .map_err(|_| Error::internal())?
        .begin_update(&token)?;
    let result = async {
        let updater = app
            .updater_builder()
            .timeout(Duration::from_secs(600))
            .build()
            .map_err(|_| update_error())?;
        let update = updater
            .check()
            .await
            .map_err(|_| update_error())?
            .ok_or_else(update_error)?;
        if !trusted(&update) || update.version != version {
            return Err(update_error());
        }
        let mut downloaded = 0_u64;
        let bytes = update
            .download(
                |chunk, total| {
                    downloaded += chunk as u64;
                    let _ = app.emit(
                        "update-progress",
                        json!({"downloaded":downloaded,"total":total}),
                    );
                },
                || {},
            )
            .await
            .map_err(|_| update_error())?;
        // Download validates the signature before any installer is invoked.
        app.state::<Mutex<Service>>()
            .lock()
            .map_err(|_| Error::internal())?
            .update_ready(&token)?;
        let _ = app.emit("update-installing", ());
        update.install(bytes).map_err(|_| update_error())?;
        Ok(())
    }
    .await;
    app.state::<Mutex<Service>>()
        .lock()
        .map_err(|_| Error::internal())?
        .finish_update(result.is_ok())?;
    result
}
