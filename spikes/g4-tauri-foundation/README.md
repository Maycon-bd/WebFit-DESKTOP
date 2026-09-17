# WebFit G4 foundation spike

Prova técnica descartável da composição proposta no ADR-0001. Usa somente dados fictícios e não representa a aplicação ou o schema de produção.

## Cobertura atual

- Tauri 2 + React/TypeScript/Vite no Windows;
- SQLite embutido no diretório privado por usuário;
- migração numerada, transacional e com checksum;
- foreign keys ativadas em toda conexão;
- comandos Rust tipados, sem SQL genérico na WebView;
- criação/listagem de paciente fictício;
- snapshot consistente, SHA-256 e restauração de verificação;
- prova opcional de SQLCipher, incluindo chave correta/incorreta e backup criptografado;
- prova de proteção de chave com DPAPI `CurrentUser`;
- caminhos Unicode, erro de filesystem e falta de espaço simulada;
- CSP restritiva para o shell do spike;
- MSI e NSIS.

## Validação

```powershell
npm run build
cd src-tauri
cargo fmt --all -- --check
cargo clippy --all-targets -- -D warnings
cargo test
cargo test --no-default-features --features sqlcipher-spike sqlcipher_encrypts_database_and_rejects_wrong_key
cd ..
npm run tauri build
```

A compilação limpa da feature `sqlcipher-spike` requer uma distribuição Perl completa para compilar o OpenSSL vendorizado. Essa feature e a prova de DPAPI avaliam candidatos; não definem a estratégia de produção nem uma política de recuperação de chaves.

Consulte `.harness/evidence/g4-spike-2026-09-17.md` para resultados e pendências.