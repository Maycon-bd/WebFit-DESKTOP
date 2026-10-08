# WEBFIT-8 — Verification

2026-10-08. RF-UX-004 / DEC-056 / TA-UX-BRAND-001..004. Windows local, Node/npm/Rust existentes; branch main, base e07cdc8300de0421dbdc7fd64aafe7d30a191e80. Versão mantida em 0.1.8. Somente dados fictícios.

## Resultados objetivos

| Check | Resultado |
|---|---|
| Fonte PNG | 1254×1254, Format32bppArgb, alpha do canto 0, sem texto; SHA256 9a8b8c051694cf1ac98b612924f5f8ee333b99172cb1ef33760ed278ada6ad06 |
| Tauri icon | PASS: conjunto nativo da raiz gerado da fonte; ICO com 16/24/32/48/64/256 px |
| npm run format:check | PASS na árvore anterior às edições paralelas de WEBFIT-9; repetição encontrou somente tests/unit/update-check.test.ts de outra demanda, preservado |
| npm run check | PASS inicial: lint, TypeScript, 12 testes Node e build Vite; repetição após alterações paralelas: lint/TypeScript, 18 testes Node e build Vite PASS |
| prettier --check nos cinco arquivos da marca | PASS final: App.tsx, LoginInfo.tsx, style.css, index.html, tauri.conf.json |
| cargo fmt --manifest-path src-tauri/Cargo.toml --check | PASS |
| cargo test --manifest-path src-tauri/Cargo.toml --locked | PASS: 18 testes, incluindo migração, autorização, criptografia, backup/restauração SQLite |
| npm run tauri -- build --bundles nsis -- --locked | PASS: executável e NSIS x64; primeiro download NSIS falhou DNS no sandbox, repetição com permissão de rede concluiu |
| Inspeção PE como dados, sem execução | Executável e instalador contêm seis RT_ICON; seis payloads de cada arquivo correspondem byte a byte ao ICO escolhido |
| NSIS gerado | MUI_ICON/MUI_UNICON recebem icons/icon.ico; DisplayIcon e atalhos usam executável do aplicativo |
| git diff --check | PASS |
| Impeccable detect | Um aviso de borda lateral do updater preexistente; fora da alteração de marca, preservado |

Rust test usou Perl local existente e TMP/TEMP em .artifacts/test-temp-brand. Avisos não bloqueantes de hardlink/PDB OpenSSL, colisão de nome PDB e STATIC_VCRUNTIME; SQLCipher emite mensagem esperada do teste de rejeição de chave. Vite mantém aviso de chunk >500 kB. Nenhum desses avisos é atribuído à marca.

Build validado: src-tauri/target/release/webfit-desktop.exe SHA256 5366ad46a04ff6982c54b60cfa3ba2975bf44cea522d9976e56570783e5601b2; instalador src-tauri/target/release/bundle/nsis/WebFit Desktop_0.1.8_x64-setup.exe SHA256 516b17f322e7e28ba453878d4127dae25cae8e3b7cfbf9312a725cf259709657. Log local ignorado: .artifacts/branding/tauri-build.log; verificação recursos: .artifacts/branding/icon-resources.json. Artefatos target são temporários e podem ser substituídos por builds de outras demandas; não foram publicados nem instalados.

## Limites

Prévia CUA em localhost:1420 expirou; servidor Vite usado foi encerrado. Sem captura atual da interface ou ensaio real de teclado/zoom, janela/barra de tarefas/atalhos instalados. Inspeção de markup confirma alt/dimensões, object-fit e imagem dentro da lateral hidden; isso não equivale a aceite visual Windows. Desinstalador configurado no NSIS, mas não executado nem extraído separadamente.

Outros trabalhos surgiram durante a sessão: AGENTS.md/checkpoint, WEBFIT-9 em App.tsx/UpdatePanel/update-check/testes/CSS e seus artefatos. Preservados. Pacote prova recursos de identidade, não valida versão final dessas mudanças paralelas. Nenhum backend/schema/dado ou logo profissional foi alterado nesta demanda.
