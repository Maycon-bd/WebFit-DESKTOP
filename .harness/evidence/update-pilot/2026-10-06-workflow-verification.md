# Verificação local do workflow piloto — 2026-10-06

**Estado:** READY WITH WARNINGS para revisão da preparação local; não comprova T082/T083 nem autoriza publicação.

## Escopo e autoridade

Maycon respondeu “Sim” à proposta de corrigir localmente os checks, checksums e verificação pós-publicação. Nenhuma execução externa, commit, push, PR ou release foi realizada. ADR-0002/DEC-043 e tarefas T082/T083 são a trilha existente; não houve implementação de produto. Branch `feature/pbi-001-primeiro-incremento-saude`, HEAD `66f886fe2be407803298918c08798af6791fffda`; alterações preexistentes preservadas.

## Resultado

- Workflow limitado à main, publicações serializadas e versão distinta por tentativa.
- Checks existentes de TypeScript/Vite, rustfmt, Clippy, Rust/SQLite, SQLCipher e backup antes da publicação. Versão piloto aplicada depois dos checks com Cargo.lock original, evitando falha artificial de `--locked`.
- Verificador Node nativo baixa assets públicos, exige versão/plataforma/URLs esperadas, compara tamanhos, valida assinaturas Ed25519/minisign de instaladores e manifesto e confere o endpoint latest.
- SHA256SUMS calculado sobre bytes baixados e publicado somente depois dessa validação; conteúdo conferido por novo download. Credencial somente em chamadas a api.github.com/uploads.github.com, com redirecionamento autenticado proibido; downloads públicos sem token.
- Testes com dados fictícios cobrem assinatura válida, alteração do instalador/comentário, chave diferente, versão incorreta, HTTP, origem externa, ausência de plataforma/asset e checksum conhecido/nome inseguro.

## Checks locais

| Comando | Resultado |
|---|---|
| `node --test scripts/pilot-release.test.mjs` | 3 testes passaram |
| `node --check scripts/pilot-release.mjs` | passou |
| `npm run build` no spike | TypeScript/Vite passou |
| `cargo fmt --all -- --check` | passou |
| `cargo clippy --offline --locked --all-targets -- -D warnings` | passou |
| `cargo test --offline --locked` | 7 testes Rust/SQLite passaram |
| `cargo test --offline --locked --no-default-features --features sqlcipher-spike sqlcipher_encrypts_database_and_rejects_wrong_key` | 1 teste passou; mensagens HMAC esperadas no cenário de chave incorreta |
| `cargo test --offline --locked --no-default-features --features sqlcipher-spike portable_backup` | 1 teste passou, round-trip e auditoria de recuperação |
| `git diff --check` nos arquivos desta etapa | passou |

Rust utilizou dependências/cache locais, sem instalação. Avisos de cache sem hard links e PDB OpenSSL ausente são limitações de debug, sem falha nos checks concluídos. Nenhum segredo ou dado clínico foi usado nos testes do verificador.

## Limites e próxima ação

Verificação de workflow foi estática; nenhum parser YAML/actionlint instalado foi localizado e nenhum foi instalado. Não existem scripts separados de lint/testes frontend no spike. Build Tauri assinado e APIs externas não foram executados; testes de comportamento do updater e review independente permanecem pendentes.

O workflow ainda publica antes da verificação pública. Uma falha posterior marca o job como falho, mas pode deixar release/manifesto acessíveis; não há remoção ou rollback automático. SHA256SUMS não substitui a assinatura. Antes da primeira publicação, revisar essa limitação, proteção de branch, permissões do token, custódia portátil e ambiente do serviço (incluindo Perl completo para compilação limpa SQLCipher). Obter autorização específica de publicação conforme AGENTS.md; não reabrir decisões arquiteturais já aceitas.

Fontes primárias conferidas: [contrato da ação Tauri v1](https://raw.githubusercontent.com/tauri-apps/tauri-action/v1/action.yml) para outputs releaseId/appVersion e uploads; [updater Tauri](https://v2.tauri.app/plugin/updater/) para manifesto estático e assinatura. Revisão local não representa aceite humano nem review independente.
