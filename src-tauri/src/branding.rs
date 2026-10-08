use windows_sys::Win32::{
    Foundation::HWND,
    System::LibraryLoader::GetModuleHandleW,
    UI::WindowsAndMessaging::{
        LoadImageW, SendMessageW, ICON_BIG, IMAGE_ICON, LR_DEFAULTSIZE, LR_SHARED, WM_SETICON,
    },
};

pub fn set_taskbar_icon(hwnd: HWND) -> std::io::Result<()> {
    // Tauri/Tao sets ICON_SMALL; Windows otherwise resolves the taskbar icon via the shell.
    // Load the same embedded app resource explicitly for ICON_BIG, independently of shortcuts.
    // LR_SHARED gives Windows ownership of this handle for the process lifetime.
    unsafe {
        let module = GetModuleHandleW(std::ptr::null());
        if module.is_null() {
            return Err(std::io::Error::last_os_error());
        }
        let icon = LoadImageW(
            module,
            tauri::utils::platform::WINDOWS_APP_ICON_RESOURCE_ID as usize as *const u16,
            IMAGE_ICON,
            0,
            0,
            LR_DEFAULTSIZE | LR_SHARED,
        );
        if icon.is_null() {
            return Err(std::io::Error::last_os_error());
        }
        assign_taskbar_icon(hwnd, icon);
    }
    Ok(())
}

// Both handles remain valid for the synchronous call; the icon must outlive the window.
unsafe fn assign_taskbar_icon(hwnd: HWND, icon: windows_sys::Win32::Foundation::HANDLE) {
    SendMessageW(hwnd, WM_SETICON, ICON_BIG as usize, icon as isize);
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::os::windows::ffi::OsStrExt;
    use windows_sys::Win32::UI::WindowsAndMessaging::{
        CreateWindowExW, DestroyIcon, DestroyWindow, LR_LOADFROMFILE, WM_GETICON,
    };

    #[test]
    fn hidden_window_receives_large_icon_from_brand_asset() {
        // A disposable hidden native window; no product process or patient storage is opened.
        // Rust lib test executables have no Tauri resource section; load the same ICO as data.
        let assets = tempfile::tempdir().unwrap();
        let asset = assets.path().join("brand.ico");
        std::fs::write(&asset, include_bytes!("../icons/icon.ico")).unwrap();
        let path: Vec<u16> = asset.as_os_str().encode_wide().chain([0]).collect();
        unsafe {
            let icon = LoadImageW(
                std::ptr::null_mut(),
                path.as_ptr(),
                IMAGE_ICON,
                0,
                0,
                LR_DEFAULTSIZE | LR_LOADFROMFILE,
            );
            assert!(!icon.is_null(), "{}", std::io::Error::last_os_error());
            let class: Vec<u16> = "STATIC\0".encode_utf16().collect();
            let hwnd = CreateWindowExW(
                0,
                class.as_ptr(),
                std::ptr::null(),
                0,
                0,
                0,
                0,
                0,
                std::ptr::null_mut(),
                std::ptr::null_mut(),
                GetModuleHandleW(std::ptr::null()),
                std::ptr::null(),
            );
            assert!(!hwnd.is_null());
            let before = SendMessageW(hwnd, WM_GETICON, ICON_BIG as usize, 0);
            assign_taskbar_icon(hwnd, icon);
            let actual = SendMessageW(hwnd, WM_GETICON, ICON_BIG as usize, 0);
            DestroyWindow(hwnd);
            DestroyIcon(icon);
            assert_eq!(
                before, 0,
                "the unconfigured window reproduces the missing large icon"
            );
            assert_eq!(actual, icon as isize, "the brand icon must be assigned");
        }
    }
}
