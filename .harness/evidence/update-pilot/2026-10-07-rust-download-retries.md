# Bootstrap Rust com tentativas limitadas — 2026-10-07

Demanda existente: RF-UPD-001 / DEC-053 / T113. STRICT por infraestrutura; continuação da preparação do piloto, sem requisito novo de produto. Maycon aprovou a correção local nesta conversa. Branch main; HEAD-base aa5bd99c754c821087ec6b05d69ffeda29205a14, árvore limpa antes da mudança. Sem fetch, commit, push, publicação ou operação no runner real.

## Evidência e aprovação

Captura fornecida da execução https://github.com/Maycon-bd/WebFit-DESKTOP/actions/runs/37672628810/job/112967989402: preparação falhou após 24m32s; download de rustc terminou com `Transferred a partial file`, faltando 25725092 bytes. Logs integrais privados não acessados. Evidência anterior registra falha de stream com o backend padrão; curl também falhou. Causa específica da rede não confirmada.

Aprovado: voltar ao mecanismo padrão, limitar tentativas e preservar versões e integridade. Detalhes internos AUTO: três tentativas, pausas 2s/4s, timeout 120s por tentativa do instalador/checksum. Download de componentes mantém limites do Rustup. Rustup 1.29.1/Rust 1.98.1, origem HTTPS oficial e SHA-256 preservados. `RUSTUP_USE_CURL=0` evita curl mesmo herdado da conta do runner. Sem mirror alternativo, bypass TLS ou limpeza de cache.

Fonte: https://raw.githubusercontent.com/rust-lang/rustup/1.29.1/src/download/mod.rs, linhas 123–176. Tentativa curl anterior permanece como histórico.

## Implementação

scripts/runner-env.mjs: classificação de transporte, máximo três tentativas; stderr limitado a 16KiB sem mudar emissão original; erros permanentes não repetidos; requisições encerradas ao finalizar a tentativa; instalador escrito só após checksum válido. Rustup instalado com toolchain `none`, componentes fixados instalados separadamente sob retry, evitando instalação inicial sem retry e duplicação. Workflow testa preparação antes do bootstrap. Testes usam respostas fictícias e subprocesso Node; não executam Rustup nem rede.

Guias operacionais e checkpoint atualizados; T113 permanece pendente de execução real.

## Verification

`node --check scripts/runner-env.mjs`: PASS.
`node --test scripts/runner-env.test.mjs scripts/pilot-release.test.mjs scripts/prepare-pilot.test.mjs scripts/stage-pilot.test.mjs`: 23 PASS, 0 FAIL (Node 22.21.0). Cobertura: transferência parcial/stream, recuperação, limite três tentativas, stderr, HTTP 503/403, socket/timeout aninhados, integridade SHA-256 e cancelamento de requisições.

Frontend, Rust/SQLite, build Tauri/publicação não executados: produto não alterado e nenhum ensaio real autorizado nesta correção. Checks reais mantidos no workflow.

## Review e handoff

Revisão independente de código concluída por rust_bootstrap_review: nenhum finding acionável; sem downloads ou execução do runner. `git diff --check`: PASS. Estado READY WITH WARNINGS: checks locais passam; rede/publicação não confirmadas. Maycon integra os arquivos pelo seu fluxo Git e executa workflow com a nova revisão. Reexecutar job antigo usa script antigo. Nenhum gate de produto fechado por testes locais.
