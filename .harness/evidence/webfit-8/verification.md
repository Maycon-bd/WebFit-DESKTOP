# WEBFIT-8 — Verification

## Continuação — barra de tarefas, 2026-10-08

RF-UX-004/TA-UX-BRAND-002, main/680fad5616d54a895dbecc6702595a1b5d232cfd. Screenshot relatado por Maycon: janela nova, W antigo na barra apenas enquanto aberto; atalho na área de trabalho. Executável instalado 0.1.9-pilot.16.1: seis RT_ICON, seis hashes iguais aos payloads do ICO atual. Atalho Desktop aponta para ele, IconLocation implícita. Cache do shell é hipótese; não foi reproduzido o W nesta máquina, sem ensaio do produto no host.

Código local Tauri runtime 2.12.1/Tao 0.37.1: SetIcon define apenas ICON_SMALL, taskbar_icon default ausente. Correção aplica WM_SETICON/ICON_BIG com recurso Tauri no setup. [WM_SETICON](https://learn.microsoft.com/en-us/windows/win32/winmsg/wm-seticon) e [LoadImageW](https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-loadimagew) conferidos. LR_SHARED deixa o handle sob ownership do Windows; nenhuma limpeza de cache, execução de produto ou edição de atalho instalado.

- PASS `npm run format:check`, `npm run check`: lint/TypeScript/18 Node/build Vite. Aviso de chunk preexistente.
- PASS `cargo fmt --manifest-path src-tauri/Cargo.toml --check`.
- PASS `cargo test --manifest-path src-tauri/Cargo.toml --locked`: 19 testes, incluindo Rust/SQLite/backup e janela Windows oculta. Teste constata WM_GETICON/ICON_BIG zero antes e handle da marca após associação; janela destruída antes do ícone, arquivo temporário isolado. Log local ignorado `.artifacts/branding/taskbar-rust-tests.log`.
- Dois ajustes do harness de teste: o lib-test não tem seção de recursos (1812); arquivo temporário aberto não carregou em LoadImageW. Teste final usa cópia fechada da fonte ICO para testar associação real, separando inspeção do recurso PE do build. Sem remoção/enfraquecimento de critérios.
- PASS `cargo clippy --manifest-path src-tauri/Cargo.toml --locked --all-targets -- -D warnings`; avisos de hardlink do ambiente, sem findings Clippy.
- PASS `npm run tauri -- build --bundles nsis -- --locked`: executável release e NSIS gerados. Primeiro empacotamento falhou DNS no sandbox; repetição com permissão concluiu. Inspeção como dados do executável/instalador: seis RT_ICON em cada, seis payloads correspondentes ao ICO atual. Logs locais ignorados `.artifacts/branding/taskbar-build.log` e `taskbar-icon-resources.json`. Review independente e aceite visual do pacote atualizado pendentes.

SHA256 final: executável `65a2d6302ba2f1d1889206e77a0bfa63ca4c748ee8262a5dd0bbf84c6cb243f0`; NSIS `9c3f6dc6670d6248517236e3fd221dfd0b01f38729b6883e324f37782dd82520`. Versão local 0.1.8 somente para verificação; piloto instalado 0.1.9-pilot.16.1 não foi substituído. Autorrevisão confirma ownership LR_SHARED, recurso público Tauri, chamada no setup e escopo; nenhum finding bloqueante identificado. Não há review independente/aceite visual, portanto não declarar REVIEW PASSED/READY TO SHIP.

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
