use std::io::{self, Read};
use zeroize::Zeroizing;

fn main() {
    // This utility outputs only a PHC verifier, never the input password.
    let mut password = Zeroizing::new(String::new());
    if io::stdin()
        .take(1026)
        .read_to_string(&mut password)
        .is_err()
    {
        eprintln!("Não foi possível ler a senha protegida.");
        std::process::exit(1);
    }
    let password = password.trim_end_matches(['\r', '\n']);
    match webfit_license_protocol::credential("admin", password) {
        Ok(value) => println!("{}", value.verifier),
        Err(_) => {
            eprintln!("Use uma senha entre 12 caracteres e 1024 bytes.");
            std::process::exit(1);
        }
    }
}
