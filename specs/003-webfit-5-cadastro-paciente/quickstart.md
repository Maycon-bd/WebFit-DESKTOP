# Verificação — WEBFIT-5

Somente dados fictícios em diretório temporário. [Resultados e limites](plan.md#verificação).

## Comandos

- `npm run check`: lint, TypeScript, testes Node (inclui SQL real de migration003 e SSR dos componentes) e build Vite.
- `npm run format:check`.
- `cargo fmt --manifest-path src-tauri/Cargo.toml --check`.
- `cargo clippy --locked --offline --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings`.
- `cargo test --locked --offline --manifest-path src-tauri/Cargo.toml` (integração SQLCipher, DPAPI, snapshots e backups).
- `node node_modules/@tauri-apps/cli/tauri.js build --debug --no-bundle -- --locked --offline`.

Preparação nativa autorizada por Maycon, toolchain Rust 1.98.1 local reutilizado com ambiente restrito ao processo/cache isolado. Cargo fmt, Clippy e 46 testes Rust/SQLCipher/DPAPI PASS. Check SQL Node complementa a integração nativa. Build debug sem bundle não gera instalador nem publica atualização. Não instalar dependências adicionais sem autorização.

## Ensaio necessário

1. Criar dois pacientes somente nome/nascimento/sexo; número visível sem zeros, distinto e imediato. Reiniciar/reencontrar por número.
2. Ausência de cada obrigatório; data inválida/futura; sexo arbitrário por comando; CPF/e-mail opcionais inválidos; CPF duplicado inclusive de arquivado. Falha preserva formulário.
3. Radios por mouse/teclado, foco visível, exclusividade, leitor de tela e zoom200%; sem default. Campos do responsável parciais não bloqueiam.
4. Editar removendo CPF/contato, manter UUID/número/vínculos. Legado desconhecido visível até seleção; ausente abre sem erro.
5. Banco vazio, v1/v2 populados, idempotência e futuro; snapshot cifrado reaberto, licença/consumo/auditoria/prescrições/tags preservados; falhas com rollback.
6. Backups1/2/3, origem/destino licenciados/transferência conforme contrato. Número conhecido preservado, contador não diminui; senha incorreta, metadata divergente/futura/corrupção/falha não substituem estado.
7. Revisão independente e aceite Windows; não confundir build/SSR com funcionamento integrado.
