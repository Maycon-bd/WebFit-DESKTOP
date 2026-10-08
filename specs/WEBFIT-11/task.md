# WEBFIT-11 — Reutilizar compilação Rust no piloto

2026-10-08 / STRICT / Codex / main / HEAD 7556edeb78378fa08dcf0332df072217a10aa11b.
Plane WEBFIT-11, Fundação, Planning. Git somente leitura; upstream local 0/0, entrada limpa, sem fetch.
Autorização: Maycon pediu reduzir os gargalos destacados e executar a demanda por webfit-task. Fontes: imagem do job de 32m21s, workflow piloto, runner-env, stage-pilot e documentação operacional.

## 1. Discovery

Clippy 10m36s, testes Rust/SQLite 2m53s, build assinado 16m54s: 30m23s do total. Checkout limpa o target ignorado; ferramentas já persistem fora do checkout, mas artefatos Rust não. Tempos da imagem são baseline, não medição local.

REQ-CI-011 (prioridade neutra, aprovado no escopo pelo pedido de Maycon): reduzir recompilação repetida mantendo Clippy, testes, perfil release, SQLCipher, assinatura e validação de publicação. Aceite: cache persistente fora do checkout; comandos usam o mesmo target; staging encontra apenas a versão corrente e verifica assinatura; testes cobrem reutilização/invalidação e caminhos antigo/externo; documentar cold/warm e limite de medição.

Escopo: scripts de preparação/staging, testes e documentação. Sem dependências, alteração de produto/banco, segredos, serviço novo ou publicação. Resultado: DISCOVERY COMPLETE.

## 2. Plan

Configurar CARGO_TARGET_DIR absoluto em RUNNER_TOOL_CACHE/webfit/build-cache/webfit-desktop/rust-1.98.1-x64/target, fora de GITHUB_WORKSPACE; manter checkout limpo. Cargo gerencia fingerprints e perfis separados; não usar SHA/versão piloto na chave para evitar invalidar dependências a cada publicação. Cada máquina tem seu cache. Staging respeita target e mantém fallback para build local.

Arquivos: scripts/runner-env.mjs e teste, scripts/stage-pilot.mjs e teste, docs/operations/own-runner-setup.md, update-pipeline-design.md, este registro e checkpoint. Workflow herda GITHUB_ENV; comandos/checks continuam ativos.

Checks: suíte Node de publicação/preparação/staging; ensaio Cargo isolado offline com cache externo, segundo build sem recompilação e mudança de fonte recompilada; sintaxe e diff. Produto/UI/banco não alterados. Primeiro build frio permanece demorado; ganho real exige próximos jobs no mesmo runner. Cache exige escrita da conta do serviço e espaço em disco; nenhum cleanup automático.

Decisão técnica AGENT-PROVISIONAL D-CI-011: cache local nativo, sem action/serviço novo, em vez de remover checks ou reduzir otimização release. Validação no aceite humano.
Scope Check: alteração de infraestrutura local explicitamente solicitada, sem operação sensível adicional; critérios compreensíveis e controles preservados. Resultado: PLAN APPROVED BY SCOPE.

Fontes técnicas verificadas: [Cargo build cache](https://doc.rust-lang.org/cargo/reference/build-cache.html), [checkout v4 clean](https://github.com/actions/checkout/blob/v4/README.md), [Tauri CLI 2.11.3](https://github.com/tauri-apps/tauri/blob/tauri-cli-v2.11.3/crates/tauri-cli/src/interface/rust.rs) get_cargo_target_dir/get_target_dir: metadata Cargo determina target e perfil, sem --target no workflow atual.

## 3. Execution

Preparação exporta target externo para todos os passos; staging acompanha env e preserva fallback, filtro de versão, assinatura, hashes e recusa de saída antiga. Documentação operacional registra cold/warm, conta do serviço e espaço.

PASS: 33/33 testes Node incluindo ensaio Cargo offline opt-in (WEBFIT_TEST_CARGO_CACHE=1), assinatura alterada, staging externo com espaços e fallback. Cargo fixture confirma cache sobrevivendo à recriação do checkout, build inalterado sem Compiling e mudança de fonte recompilada. Primeiro ensaio falhou por escrita Rust no TEMP do sandbox; fixture movida para .artifacts/release-tests, isolada e removida no finally, então passou. Sem escalada/instalação.
PASS: node --check dos scripts alterados, git diff --check, cargo fmt, metadata Cargo real do produto com target externo, npm run format:check, lint, typecheck e 18 testes frontend. Build frontend concluído registrado na revisão. Clippy/testes Rust/SQLite completos e build NSIS real NOT RUN nesta alteração exclusiva de scripts; não houve edição do runtime. Publicação/tempo real NOT RUN, dependem da integração e próximos jobs humanos. Resultado: EXECUTION COMPLETE.

## 4. Code Review

Revisor independente: agente review_four_phases, passagem read-only no diff/registro/fontes oficiais em 2026-10-08. Nenhum finding impeditivo; testes do executor inspecionados, não reexecutados pelo revisor.

Correctness PASS: preparação exporta target absoluto fora do checkout; todos os passos herdam GITHUB_ENV; CLI Tauri 2.11.3 utiliza target_directory do metadata Cargo. Security PASS no escopo: checks/perfis/SQLCipher/assinatura preservados; staging recusa bytes adulterados e saída ocupada; versão única filtra assets antigos. Permissões reais da conta do serviço e build NSIS assinado NOT RUN. UI NOT APPLICABLE, interface não modificada.

Tests PASS: 33/33 Node (suíte completa com WEBFIT_TEST_CARGO_CACHE=1); staging 2/2 novamente após incluir instalador de versão antiga; metadata externo, Rust fmt, frontend format/lint/typecheck/18 testes/build e diff. Sem execução de publicação ou acesso a secrets. Ensaio fictício não comprova economia de SQLCipher/OpenSSL no runner real. Fonte recriada pode recompilar; cache preserva dependências e Cargo decide validade.

WARNING frontend: Vite sinalizou chunk JS de 535,96 kB acima de 500 kB; build passou, fontes de produto não alteradas nesta demanda. Otimização desse bundle fora do escopo dos gargalos Rust.

### Ensaio real autorizado — 2026-10-08

Maycon autorizou explicitamente commit/envio na main e uma publicação piloto para medir o tempo. Entrada limpa em main, HEAD f6a8d7a30b81fcc4514394634685b92984ecfbfd, upstream local alinhado; implementação já integrada pelo usuário. Novo commit documental registra o ensaio e dispara uma publicação pelo push, sem alteração do produto ou versão manual.

Baseline real do cache inicial: [run #15](https://github.com/Maycon-bd/WebFit-DESKTOP/actions/runs/37797076176), success, runner DESKTOP-GEUP094. Job 15:09:43–15:45:30 UTC: 35m47s; Clippy 13m49s, testes Rust/SQLite 3m06s, build assinado 16m44s. Verificações local/pública PASS. Histórico mostra 45m37s incluindo espera; compare duração do job separadamente. Dados consultados na API pública de jobs. Próxima publicação mede cache aquecido; resultado ainda pendente.

Resultado posterior confirmado: [run #16](https://github.com/Maycon-bd/WebFit-DESKTOP/actions/runs/37810122317), commit 680fad5616d54a895dbecc6702595a1b5d232cfd, success no mesmo DESKTOP-GEUP094. Criado 16:36:30 UTC, job iniciado 16:36:33 e concluído 16:42:47: espera até o job de 3s, execução 6m14s. Redução observada de 29m33s (82,58%) frente a #15, excluindo fila.

| Etapa | #15 inicial | #16 aquecido | Redução |
| --- | --- | --- | --- |
| Clippy | 13m49s | 20s | 97,59% |
| Rust/SQLite | 3m06s | 38s | 79,57% |
| Build assinado | 16m44s | 3m30s | 79,08% |
| Job completo | 35m47s | 6m14s | 82,58% |

API pública confirmou todas essas etapas e verificação pública com success. Evidência real satisfaz o ensaio de publicação/permissões/tempo antes pendente neste runner. Comparação compatível com reutilização do cache, sem experimento controlado para isolar outros efeitos e sem garantia para todo build futuro, mudança de máquina/toolchain ou dependências. Aceite humano/D-CI-011 continuam pendentes; referências anteriores NOT RUN e integração pendente são históricas. Monitoramento encerrado; este resultado permanece local, sem novo commit/push/publicação nesta coleta.

Evidence/inventário: scripts/runner-env.mjs/test.mjs, stage-pilot.mjs/test.mjs; docs/operations/own-runner-setup.md, update-pipeline-design.md; este task.md e docs/project/status.md. Entrada limpa e somente esses owners alterados, main/HEAD original mantidos; sem Git mutável, dependências novas ou mudanças no runtime/banco.

D-CI-011 AGENT-PROVISIONAL aplicada e aguardando validação humana no aceite. Resultado: REVIEW PASSED WITH WARNINGS; READY TO SHIP para integração humana, com medição/permissões/NSIS real pendentes explícitos. Aceite final humano pendente; Plane encaminhado a Review, não Done. Próxima ação: Maycon integrar os oito owners pelo fluxo Git e comparar ao menos dois jobs no mesmo runner (primeiro frio, seguinte aquecido); repetir caso mude de máquina. Nenhum tempo prometido. Git/publicação sob controle de Maycon.
