# RN-AUT-001 — senhas de acesso com seis caracteres

## Autoridade e escopo

Maycon solicitou em 2026-10-07 mínimo de seis caracteres para login ao testar a preparação da instalação. DEC-047 altera RN-AUT-001 e substitui somente o mínimo da DEC-017, preservando espera progressiva e demais controles. Refinamento da implementação G5/DEC-045 em branch de feature já existente; sem nova dependência, integração externa ou publicação. Mesmo worktree e alterações preexistentes preservados.

## Implementação 0.1.2

- src-tauri/src/security.rs: mínimo de seis caracteres na função central usada para criação, troca e redefinição de senhas; Argon2 e verificação de hashes existentes preservados.
- src/App.tsx: minLength seis em administrador, nutricionista, troca e senha temporária; labels informam os limites. Login não impõe um novo limite na verificação de credenciais existentes.
- src/onboarding.ts: tutorial de Acesso atualizado para seis.
- Recuperação de backups permanece doze no formulário e no backend; nenhum schema, chave, usuário, sessão ou banco existente alterado.
- npm/Cargo/Tauri 0.1.2; roteiro de teste e rastreabilidade RN-AUT-001/T088–T090 atualizados.

## Verificação

npm run check PASS: lint, TypeScript, 4 testes Node e build frontend. npm run format:check, cargo fmt --check e cargo clippy --locked --all-targets -- -D warnings PASS. cargo test --locked: 14 testes Rust PASS; novo teste six_character_access_passwords_work_and_recovery_remains_twelve cobre hash, setup/login, troca, redefinição, obrigação de troca temporária e limite de recuperação. Detect de UI sem ocorrências ([]). Testes anteriores preservam credenciais mais longas.

Não houve instalação/execução do produto no host ou inspeção visual; imagem enviada pelo usuário evidencia a validação antiga de oito no formulário. Ensaio manual T090 pendente no Windows 10 x64 com dados fictícios. Não declarar G5/G6/G7 concluídos.

## Empacotamento e limites

Instalador NSIS x64 currentUser com WebView2 offline. Versões 0.1.0/0.1.1 preservadas. Build Tauri/NSIS concluído com exit code 0; hashes registrados abaixo. Avisos de empacotamento previamente conhecidos: PDB bin/lib, STATIC_VCRUNTIME deprecado e OpenSSL sem PDB. Sem commit/push, PR/merge/release ou mudança remota. Revisão independente e aceite clínico completos continuam pendentes; somente dados fictícios.


## Artefato e checkpoint

- .artifacts/mvp/2026-10-07/password-0.1.2/WebFit-Desktop-0.1.2-teste-x64.exe
- 218.873.637 bytes; SHA256 `68af849a978b64bbf9fc6d8deba721a9fd99052dae462bdce56000e553bf248d`; Authenticode NotSigned.
- BUILD-MANIFEST.json, SHA256.txt e COMO-TESTAR.md acompanham a cópia; versões anteriores preservadas.
- Branch feature/pbi-001-primeiro-incremento-saude, HEAD/commit-base 66f886fe2be407803298918c08798af6791fffda; upstream local sem indicação ahead/behind. Fontes não commitadas e alterações preexistentes preservadas. git diff --check PASS.
- Próxima ação: Maycon confirma primeiro acesso/atualização manual e tours, com dados fictícios. Não concluir G5/G6/G7 sem os ensaios/revisão/aceite pendentes.
