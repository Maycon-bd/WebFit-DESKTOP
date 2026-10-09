# WEBFIT-21 — Novidades após atualização e login

Data: 2026-10-09. STRICT pela preferência persistente por usuário em SQLite existente.
Plane: WEBFIT-21, `2464f42b-212d-4589-b686-4b020197934a`. Branch `main`, HEAD/base `064af8f8a7898687a879a5662d56124b30c57e23`, ahead 1 dos refs locais, sem fetch/Git mutável. Árvore limpa na entrada; trabalho humano anterior preservado.

## 1. Discovery

Maycon pediu resumo não técnico das novidades após atualização/login e confirmou **uma vez por usuário/atualização, com consulta posterior**. RF-UPD-002 / TA-UPD-NEWS-001..008 aprovados pelo pedido e resposta, sem aprovação clínica inferida. O aviso pré-instalação existente não informa a versão já instalada depois de reiniciar. Há preferências por usuário em `settings`, autorização central e diálogo nativo acessível, sem necessidade de schema/migration/dependência.

Escopo: nutricionista e administrador autenticados; resumo da versão instalada, offline, texto curto; abertura automática quando ainda não lido, botão Entendi e consulta Ver novidades no menu da conta. Troca obrigatória de senha vem primeiro; tours aguardam o aviso. Fechar/Escape confirmam leitura após mostrar conteúdo; falha de gravação oferece retry ou fechar por agora, preservando pendência para o próximo login. Falha de consulta não bloqueia trabalho. Sem informações clínicas/técnicas/segredos, publicação ou execução em banco de uso.

Resultado: DISCOVERY COMPLETE. Fonte/requisitos: ADR-0002, RF-UPD-001, RF-UX-003, docs/project/status.md, pedido nesta conversa. Git atual informado ao humano.

## 2. Plan

1. Conteúdo editorial local único `src/data/release-notes.json`, título e poucos tópicos em linguagem da nutricionista. Notas correspondem ao código embarcado; nenhum download/renderização HTML. Manter esse conteúdo em mudanças de produto e validar conteúdo não vazio no build/publicação. Versão da leitura é a versão instalada do Rust, incluindo sufixo piloto gerado pelo pipeline, sem manter versão duplicada na nota.
2. Backend: comandos autenticados para consultar e confirmar leitura da versão corrente; chave de preferência inclui usuário e versão, derivada no Rust. Sem aceitar usuário/versão arbitrários da WebView. Reusar `settings`; não alterar autenticação/permissões/migrações.
3. Interface: modal nativo curto, foco/teclado/Escape e dimensões responsivas, acesso posterior no menu da conta. Conteúdo mostra benefícios e novidades, sem IDs, hashes, nomes de biblioteca ou promessas de aceite clínico. Erros não bloqueiam o consultório; gravação idempotente e consulta tardia não atravessam logout/login.
4. Pipeline local: manifesto pré-atualização usa o mesmo resumo em vez de texto genérico; build valida notas. Documentar manutenção a cada entrega, sem execução/publicação remota.
5. Regressões: versão/usuário/autoridade/persistência/relogin/offline, falta de notas, versão piloto; UI automático/manual/erro/retry/Escape/foco/viewport. Lint/TypeScript/Node/Rust/SQLCipher/formato/Clippy/build Tauri e review independente.

Arquivos: `src/ReleaseNotes.tsx`, App/style/api, JSON; módulo Rust/service/lib e testes; scripts de validação/staging/testes pertinentes; guia de publicação/notas, requisitos/rastreabilidade/DESIGN/AGENTS/checkpoint. Sem refatoração ampla.

D-NEWS-001 AGENT-PROVISIONAL: conteúdo atual único embarcado e versão obtida do binário; opção mais simples que histórico remoto. Inclui primeiro login de instalação nova, pois ainda não há leitura dessa versão; consulta posterior permanece. Confiança alta, impacto baixo/reversível. Fechar marca leitura apenas por comando backend; não persistir domínio no localStorage. Sem migração, dependência, mudança sensível de acesso ou ADR material. Scope Check: PLAN APPROVED BY SCOPE; pedido explícito suficiente autoriza execução contínua. Somente dados fictícios.

## 3. Execution

EXECUTION COMPLETE. Resumo editorial local compartilhado pelo diálogo e manifesto de atualização; leitura autenticada por usuário/versão em `settings`, persistente e idempotente. Diálogo após login, consulta no menu da conta, foco/Escape, espera do tour e recuperação de falhas implementados. Sem schema/migração/dependência nova, execução em banco de uso ou publicação.

Checks locais PASS: `npm run check` (lint, TypeScript, 67 testes e Vite); `npm run format:check`; Cargo fmt; Cargo test offline/locked (63 testes, incluindo SQLite/SQLCipher, leitura por usuário/versão, reinício e backup/restauração); Clippy all-targets com -D warnings; Tauri debug offline/locked sem bundle; staging (2 testes); UI Chrome/IPC fictício (5 cenários automático/manual, relogin, mudança de versão, consulta/gravação com erro, Escape/foco e viewport/zoom). Logs/capturas ignorados em `.artifacts/visual-test/WEBFIT-21/`. Corrigidos durante execução: fixture relogando após rejeição que revoga sessão, variantes de comando vazias para rejeitar parâmetros injetados e ordem de módulos exigida pelo fmt. Avisos ambientais de cache/linker e tamanho do chunk TBCA permanecem, sem ampliar escopo.

Documentação: criados este registro e `docs/operations/release-notes.md`; modificados requisitos/aceite/rastreabilidade, update-pipeline-design, DESIGN e AGENTS para manutenção editorial. Alterações concorrentes em Dashboard e seu runner não pertencem a esta entrega e foram preservadas. Limites: mock não comprova WebView2/instalação/update real, leitor de tela ou aceite humano. Conteúdo atual único, sem histórico de versões; validação de formato não garante atualização editorial.

## 4. Code Review

REVIEW PASSED WITH WARNINGS, revisão independente por `notes_review`, passagem read-only e recheck da correção. Um finding P2: validator aceitava propriedades extras recusadas pelo `deny_unknown_fields` Rust. Corrigido com rejeição de chaves extras e teste de regressão; frontend67/build e staging2 reexecutados PASS. Revisor confirmou resolução, sem outros bloqueadores de identidade/versão, autorização, persistência, recuperação ou foco/teclado. `git diff --check` PASS, apenas avisos de conversão de finais de linha.

Limites: cenário lento não encerra sessão antes da resposta; guardas de token/generation revisadas, mas corrida não exercitada diretamente. Windows/WebView2, leitor de tela, instalação/update real e aceite humano não executados. Conteúdo único inclui primeira instalação (D-NEWS-001) e não oferece histórico. Avisos de tamanho de bundle TBCA/cache/linker mantidos. Entrega técnica revisada; aceite humano/nativo separado, Plane em Review e não Done. Checkpoint `docs/project/status.md` atualizado na mesma entrega; Git e alterações concorrentes preservados.
