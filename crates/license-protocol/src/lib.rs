//! Offline protocol. Only public trust roots enter the clinical application.
use base64::{engine::general_purpose::STANDARD, Engine};
use crypto_box::{aead::OsRng, PublicKey, SecretKey};
use ed25519_dalek::{Signature, Signer, SigningKey, VerifyingKey};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use uuid::Uuid;
use zeroize::{Zeroize, Zeroizing};

pub const MAX_FILE: usize = 65_536;
pub type Result<T> = std::result::Result<T, &'static str>;
#[derive(Clone, Copy, Debug, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum Kind {
    Initial,
    TransferRecovery,
    TemporarySupport,
    AdminRecovery,
    ResetClinic,
}
impl Kind {
    pub fn name(self) -> &'static str {
        match self {
            Self::Initial => "INITIAL",
            Self::TransferRecovery => "TRANSFER_RECOVERY",
            Self::TemporarySupport => "TEMPORARY_SUPPORT",
            Self::AdminRecovery => "ADMIN_RECOVERY",
            Self::ResetClinic => "RESET_CLINIC",
        }
    }
    pub fn credential(self) -> bool {
        self != Self::ResetClinic
    }
}
#[derive(Clone, Debug, Serialize, Deserialize, PartialEq, Eq)]
#[serde(deny_unknown_fields)]
pub struct Request {
    pub version: u8,
    pub installation_id: Uuid,
    pub request_id: Uuid,
    pub challenge: String,
    pub recipient: String,
    pub kind: Kind,
    pub base_license_id: Option<Uuid>,
    pub source: Option<String>,
}
#[derive(Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct Credential {
    pub login: String,
    pub verifier: String,
}
impl Drop for Credential {
    fn drop(&mut self) {
        self.verifier.zeroize();
    }
}
#[derive(Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct Grant {
    pub id: Uuid,
    pub request: Request,
    pub credential: Option<Credential>,
}
#[derive(Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct Envelope {
    pub version: u8,
    pub issuer_key_id: String,
    pub id: Uuid,
    pub request: Request,
    pub ciphertext: String,
    pub signature: String,
}
pub fn encode(bytes: &[u8]) -> String {
    STANDARD.encode(bytes)
}
pub fn decode(text: &str) -> Result<Vec<u8>> {
    if text.len() > MAX_FILE {
        return Err("Arquivo de licença excede o limite.");
    }
    STANDARD.decode(text).map_err(|_| "Codificação inválida.")
}
pub fn fingerprint(bytes: &[u8]) -> String {
    encode(&Sha256::digest(bytes))
}
pub fn parse<T: serde::de::DeserializeOwned>(bytes: &[u8]) -> Result<T> {
    if bytes.len() > MAX_FILE {
        return Err("Arquivo excede 64 KiB.");
    }
    serde_json::from_slice(bytes).map_err(|_| "Formato inválido ou versão incompatível.")
}
pub fn recipient_secret() -> SecretKey {
    SecretKey::generate(&mut OsRng)
}
pub fn signing_key() -> SigningKey {
    SigningKey::generate(&mut OsRng)
}
pub fn signing_key_from_bytes(bytes: &[u8]) -> Result<SigningKey> {
    Ok(SigningKey::from_bytes(
        &bytes
            .try_into()
            .map_err(|_| "Identidade de emissão inválida.")?,
    ))
}
pub fn random_password() -> Zeroizing<String> {
    Zeroizing::new(format!("{}!aA7", Uuid::new_v4().simple()))
}
pub fn request(
    installation_id: Uuid,
    secret: &SecretKey,
    kind: Kind,
    base_license_id: Option<Uuid>,
    source: Option<String>,
) -> Request {
    Request {
        version: 1,
        installation_id,
        request_id: Uuid::new_v4(),
        challenge: encode(&recipient_secret().to_bytes()),
        recipient: encode(secret.public_key().as_bytes()),
        kind,
        base_license_id,
        source,
    }
}
fn array32(value: &str) -> Result<[u8; 32]> {
    decode(value)?
        .try_into()
        .map_err(|_| "Chave ou desafio inválido.")
}
pub fn validate_request(request: &Request) -> Result<()> {
    if request.version != 1 {
        return Err("Versão incompatível.");
    }
    array32(&request.challenge)?;
    let public = array32(&request.recipient)?;
    if public == [0; 32] {
        return Err("Destinatário inválido.");
    }
    if matches!(request.kind, Kind::Initial | Kind::TransferRecovery)
        != request.base_license_id.is_none()
    {
        return Err("Licença de base incompatível.");
    }
    if request.kind == Kind::TransferRecovery {
        if request
            .source
            .as_ref()
            .is_none_or(|s| s.is_empty() || s.len() > 100)
        {
            return Err("Informe a licença de origem ou checksum do backup.");
        }
    } else if request.source.is_some() {
        return Err("Origem inesperada.");
    }
    Ok(())
}
pub fn validate_credential(value: &Credential) -> Result<()> {
    if value.login.trim() != value.login
        || value.login.is_empty()
        || value.login.len() > 100
        || value.verifier.len() > 256
    {
        return Err("Credencial inválida.");
    }
    let hash = argon2::password_hash::PasswordHash::new(&value.verifier)
        .map_err(|_| "Verificador inválido.")?;
    // Fixed resource bounds: authenticated files still cannot request arbitrary KDF work.
    if hash.algorithm.as_str() != "argon2id"
        || hash.version != Some(19)
        || hash.params.get_decimal("m") != Some(19456)
        || hash.params.get_decimal("t") != Some(2)
        || hash.params.get_decimal("p") != Some(1)
        || hash.params.iter().count() != 3
        || hash.salt.is_none()
        || hash.hash.as_ref().is_none_or(|v| v.len() != 32)
    {
        return Err("Parâmetros de verificação incompatíveis.");
    }
    Ok(())
}
pub fn credential(login: &str, password: &str) -> Result<Credential> {
    use argon2::{
        password_hash::{PasswordHasher, SaltString},
        Argon2,
    };
    if password.chars().count() < 12 || password.len() > 1024 {
        return Err("Use ao menos 12 caracteres.");
    }
    let salt = SaltString::encode_b64(Uuid::new_v4().as_bytes())
        .map_err(|_| "Falha ao gerar credencial.")?;
    let verifier = Argon2::default()
        .hash_password(password.as_bytes(), &salt)
        .map_err(|_| "Falha ao gerar credencial.")?
        .to_string();
    let value = Credential {
        login: login.trim().to_owned(),
        verifier,
    };
    validate_credential(&value)?;
    Ok(value)
}
fn signed_bytes(envelope: &Envelope) -> Result<Vec<u8>> {
    // Explicit length framing prevents concatenation ambiguity; ciphertext is signed exactly as decoded.
    let mut bytes = b"WEBFIT-LICENSE-V1".to_vec();
    bytes.push(envelope.version);
    let request = &envelope.request;
    for field in [
        envelope.issuer_key_id.as_bytes().to_vec(),
        envelope.id.as_bytes().to_vec(),
        vec![request.version],
        request.installation_id.as_bytes().to_vec(),
        request.request_id.as_bytes().to_vec(),
        decode(&request.challenge)?,
        decode(&request.recipient)?,
        request.kind.name().as_bytes().to_vec(),
        request
            .base_license_id
            .map(|v| v.as_bytes().to_vec())
            .unwrap_or_default(),
        request
            .source
            .as_deref()
            .unwrap_or_default()
            .as_bytes()
            .to_vec(),
        decode(&envelope.ciphertext)?,
    ] {
        bytes.extend_from_slice(&(field.len() as u32).to_be_bytes());
        bytes.extend_from_slice(&field);
    }
    Ok(bytes)
}
pub fn issue(
    request: Request,
    key: &SigningKey,
    credential: Option<Credential>,
) -> Result<Envelope> {
    validate_request(&request)?;
    if request.kind.credential() != credential.is_some() {
        return Err("Credencial incompatível com o tipo.");
    }
    if let Some(value) = &credential {
        validate_credential(value)?;
    }
    let id = Uuid::new_v4();
    let grant = Grant {
        id,
        request: request.clone(),
        credential,
    };
    let clear = Zeroizing::new(serde_json::to_vec(&grant).map_err(|_| "Formato inválido.")?);
    let encrypted = PublicKey::from(array32(&request.recipient)?)
        .seal(&mut OsRng, &clear)
        .map_err(|_| "Falha de criptografia.")?;
    let mut envelope = Envelope {
        version: 1,
        issuer_key_id: fingerprint(key.verifying_key().as_bytes()),
        id,
        request,
        ciphertext: encode(&encrypted),
        signature: String::new(),
    };
    envelope.signature = encode(&key.sign(&signed_bytes(&envelope)?).to_bytes());
    Ok(envelope)
}
pub fn verify(
    bytes: &[u8],
    trusted: &[[u8; 32]],
    secret: &SecretKey,
    expected: &Request,
) -> Result<Grant> {
    verify_version(bytes, trusted, secret, expected, 1)
}

/// Portable initial activation is explicitly a different signed protocol version.
/// The random recipient key is delivered as a code, never embedded in the application.
pub fn issue_initial_code(
    key: &SigningKey,
    credential: Credential,
) -> Result<(Envelope, Zeroizing<String>)> {
    let secret = recipient_secret();
    let code = Zeroizing::new(format!("WF1-{}", encode(&secret.to_bytes())));
    let request = request(Uuid::new_v4(), &secret, Kind::Initial, None, None);
    let mut envelope = issue(request, key, Some(credential))?;
    envelope.version = 2;
    envelope.signature = encode(&key.sign(&signed_bytes(&envelope)?).to_bytes());
    Ok((envelope, code))
}

pub fn verify_initial_code(bytes: &[u8], trusted: &[[u8; 32]], code: &str) -> Result<Grant> {
    let envelope: Envelope = parse(bytes)?;
    if envelope.version != 2
        || envelope.request.kind != Kind::Initial
        || envelope.request.base_license_id.is_some()
        || envelope.request.source.is_some()
    {
        return Err("Selecione uma licença de ativação inicial com código.");
    }
    let text = code.trim();
    if text.len() != 48 {
        return Err("Código de ativação inválido.");
    }
    let raw = Zeroizing::new(decode(
        text.strip_prefix("WF1-")
            .ok_or("Código de ativação inválido.")?,
    )?);
    let secret = secret_from_bytes(&raw)?;
    verify_version(bytes, trusted, &secret, &envelope.request, 2)
}

fn verify_version(
    bytes: &[u8],
    trusted: &[[u8; 32]],
    secret: &SecretKey,
    expected: &Request,
    version: u8,
) -> Result<Grant> {
    let envelope: Envelope = parse(bytes)?;
    if envelope.version != version {
        return Err("Versão incompatível.");
    }
    validate_request(&envelope.request)?;
    let root = trusted
        .iter()
        .find(|k| fingerprint(*k) == envelope.issuer_key_id)
        .ok_or("Emissor não confiável. Verifique a configuração de confiança.")?;
    let key = VerifyingKey::from_bytes(root).map_err(|_| "Emissor inválido.")?;
    let signature =
        Signature::from_slice(&decode(&envelope.signature)?).map_err(|_| "Assinatura inválida.")?;
    key.verify_strict(&signed_bytes(&envelope)?, &signature)
        .map_err(|_| "Assinatura inválida.")?;
    if &envelope.request != expected || expected.recipient != encode(secret.public_key().as_bytes())
    {
        return Err("Autorização não corresponde à solicitação desta instalação.");
    }
    let clear = Zeroizing::new(
        secret
            .unseal(&decode(&envelope.ciphertext)?)
            .map_err(|_| "Destinatário inválido.")?,
    );
    let grant: Grant = parse(&clear)?;
    if grant.id != envelope.id
        || grant.request != envelope.request
        || grant.request.kind.credential() != grant.credential.is_some()
    {
        return Err("Conteúdo da autorização incompatível.");
    }
    if let Some(value) = &grant.credential {
        validate_credential(value)?;
    }
    Ok(grant)
}
pub fn secret_from_bytes(bytes: &[u8]) -> Result<SecretKey> {
    Ok(SecretKey::from(
        <[u8; 32]>::try_from(bytes).map_err(|_| "Identidade inválida.")?,
    ))
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn portable_code_requires_its_signature_key_and_code_and_is_not_v1() {
        let key = signing_key();
        let roots = [key.verifying_key().to_bytes()];
        let password = "fictional-portable-password";
        let (mut envelope, code) =
            issue_initial_code(&key, credential("admin", password).unwrap()).unwrap();
        let bytes = serde_json::to_vec(&envelope).unwrap();
        assert!(!String::from_utf8_lossy(&bytes).contains(password));
        assert!(!String::from_utf8_lossy(&bytes).contains(code.as_str()));
        assert!(verify_initial_code(&bytes, &roots, &code).is_ok());
        assert!(verify_initial_code(&bytes, &[], &code).is_err());
        let (_, other_code) =
            issue_initial_code(&key, credential("admin", password).unwrap()).unwrap();
        assert!(verify_initial_code(&bytes, &roots, &other_code).is_err());
        assert!(verify_initial_code(&bytes, &roots, "wrong").is_err());
        assert!(verify(&bytes, &roots, &recipient_secret(), &envelope.request).is_err());
        envelope.request.kind = Kind::AdminRecovery;
        assert!(
            verify_initial_code(&serde_json::to_vec(&envelope).unwrap(), &roots, &code).is_err()
        );
        envelope.request.kind = Kind::Initial;
        envelope.ciphertext.push('A');
        assert!(
            verify_initial_code(&serde_json::to_vec(&envelope).unwrap(), &roots, &code).is_err()
        );
    }
    #[test]
    fn signed_bound_encrypted_and_tamper_rejected() {
        let secret = recipient_secret();
        let key = signing_key();
        let request = request(Uuid::new_v4(), &secret, Kind::Initial, None, None);
        let credential = credential("admin", "fictional-password-only").unwrap();
        let mut envelope = issue(request.clone(), &key, Some(credential)).unwrap();
        let roots = [key.verifying_key().to_bytes()];
        let bytes = serde_json::to_vec(&envelope).unwrap();
        assert!(verify(&bytes, &roots, &secret, &request).is_ok());
        assert!(verify(&bytes, &[], &secret, &request).is_err());
        assert!(verify(&bytes, &roots, &recipient_secret(), &request).is_err());
        let mut other = request.clone();
        other.kind = Kind::ResetClinic;
        assert!(verify(&bytes, &roots, &secret, &other).is_err());
        envelope.ciphertext.push('A');
        assert!(verify(
            &serde_json::to_vec(&envelope).unwrap(),
            &roots,
            &secret,
            &request
        )
        .is_err());
    }
    #[test]
    fn strict_input_and_kdf_bounds() {
        assert!(parse::<Request>(&vec![0; MAX_FILE + 1]).is_err());
        assert!(parse::<Request>(br#"{"version":1,"version":1}"#).is_err());
        let mut credential = credential("admin", "fictional-password-only").unwrap();
        credential.verifier = credential.verifier.replace("m=19456", "m=999999");
        assert!(validate_credential(&credential).is_err());
    }
}
