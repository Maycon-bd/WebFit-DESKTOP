use crate::{Error, Result};
use argon2::{
    password_hash::{PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};
use uuid::Uuid;
use zeroize::Zeroizing;

pub fn random_key() -> Zeroizing<Vec<u8>> {
    // UUID v4 comes from the operating-system CSPRNG; exclude fixed version/variant bits.
    let mut bytes = Vec::with_capacity(32);
    while bytes.len() < 32 {
        let block = Uuid::new_v4();
        bytes.extend(
            block
                .as_bytes()
                .iter()
                .enumerate()
                .filter(|(i, _)| *i != 6 && *i != 8)
                .map(|(_, b)| *b),
        );
    }
    bytes.truncate(32);
    Zeroizing::new(bytes)
}
pub fn hash_password(password: &str) -> Result<String> {
    if password.chars().count() < 6 {
        return Err(Error::validation(
            "A senha precisa ter pelo menos 6 caracteres.",
        ));
    }
    let salt = SaltString::encode_b64(Uuid::new_v4().as_bytes()).map_err(|_| Error::internal())?;
    Argon2::default()
        .hash_password(password.as_bytes(), &salt)
        .map(|h| h.to_string())
        .map_err(|_| Error::internal())
}
pub fn verify_password(password: &str, hash: &str) -> bool {
    PasswordHash::new(hash).is_ok_and(|h| {
        Argon2::default()
            .verify_password(password.as_bytes(), &h)
            .is_ok()
    })
}
pub fn derive(password: &str, salt: &[u8]) -> Result<Zeroizing<Vec<u8>>> {
    let mut key = Zeroizing::new(vec![0; 32]);
    Argon2::default()
        .hash_password_into(password.as_bytes(), salt, &mut key)
        .map_err(|_| Error::internal())?;
    Ok(key)
}
pub fn protect(bytes: &[u8], decrypt: bool) -> Result<Zeroizing<Vec<u8>>> {
    use windows_sys::Win32::{
        Foundation::LocalFree,
        Security::Cryptography::{
            CryptProtectData, CryptUnprotectData, CRYPTPROTECT_UI_FORBIDDEN, CRYPT_INTEGER_BLOB,
        },
    };
    let input = CRYPT_INTEGER_BLOB {
        cbData: bytes.len().try_into().map_err(|_| Error::internal())?,
        pbData: bytes.as_ptr().cast_mut(),
    };
    let mut output = CRYPT_INTEGER_BLOB::default();
    // DPAPI CurrentUser; no machine-wide flag, and no interactive prompt.
    let success = unsafe {
        if decrypt {
            CryptUnprotectData(
                &input,
                std::ptr::null_mut(),
                std::ptr::null(),
                std::ptr::null(),
                std::ptr::null(),
                CRYPTPROTECT_UI_FORBIDDEN,
                &mut output,
            )
        } else {
            CryptProtectData(
                &input,
                std::ptr::null(),
                std::ptr::null(),
                std::ptr::null(),
                std::ptr::null(),
                CRYPTPROTECT_UI_FORBIDDEN,
                &mut output,
            )
        }
    };
    if success == 0 {
        return Err(Error::validation(
            "Não foi possível acessar a chave neste perfil Windows. Use a recuperação de backup.",
        ));
    }
    // The successful API owns a cbData-sized buffer until LocalFree.
    let data = unsafe {
        Zeroizing::new(std::slice::from_raw_parts(output.pbData, output.cbData as usize).to_vec())
    };
    unsafe {
        std::ptr::write_bytes(output.pbData, 0, output.cbData as usize);
        LocalFree(output.pbData.cast());
    }
    Ok(data)
}
pub fn windows_locked() -> bool {
    use windows_sys::Win32::System::RemoteDesktop::*;
    let mut buffer = std::ptr::null_mut();
    let mut size = 0;
    let ok = unsafe {
        WTSQuerySessionInformationW(
            std::ptr::null_mut(),
            WTS_CURRENT_SESSION,
            WTSSessionInfoEx,
            &mut buffer,
            &mut size,
        )
    };
    if ok == 0 {
        return true;
    }
    let locked = if size as usize >= std::mem::size_of::<WTSINFOEXW>() {
        // Windows 10+ uses 0 for locked and 1 for unlocked.
        unsafe {
            (*(buffer.cast::<WTSINFOEXW>()))
                .Data
                .WTSInfoExLevel1
                .SessionFlags
                != WTS_SESSIONSTATE_UNLOCK as i32
        }
    } else {
        true
    };
    unsafe {
        WTSFreeMemory(buffer.cast());
    }
    locked
}
