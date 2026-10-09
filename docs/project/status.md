# Status operacional — WebFit Desktop

> Este é o único checkpoint operacional para retomar o trabalho em outra máquina. Atualize-o ao terminar cada sessão e antes de trocar de computador.

## Checkpoint — continuidade catálogo, auditoria e backup, 2026-10-08

- Branch/commit-base: `main` / `538091c4b25b1cba2ff566c885b9bd255c019a68`; referência local origin/main alinhada, sem fetch/pull. Avanço humano desde 3558edd reconhecido; WEBFIT-5 e modal preexistentes preservados. Sem Git mutável/publicação nesta demanda.
- Pedido: Maycon confirmou instalação/acesso bem-sucedidos e retomou as pendências do primeiro incremento. Autorizou prosseguir e informou possuir autorização TBCA, sem arquivo/link offline fornecido. Reutilizados artefatos de specs/001-primeiro-incremento-saude e DEC-045, somente dados fictícios. Vínculo Plane pendente, sem ID inventado/reabrir item legado.
- Última etapa: correções locais de escopo HEALTH/cursor recuperável na auditoria, falhas automáticas SYSTEM/manuais USER, estado de backup, cleanup/publicação e alerta de sessão incluindo erro ao criar cópia de segurança na restauração. 46 testes Rust/SQLCipher/DPAPI e 37 frontend PASS; lint/TS/build frontend, fmt/Prettier/diff, Clippy e build Tauri debug sem bundle PASS. Rust 1.98.1 instalado em .tools/validation com autorização humana específica. Warnings ambientais/cache, PDB OpenSSL e STATIC_VCRUNTIME registrados, sem findings abertos no recorte.
- Review independente estática: finding P2 no aviso após falha da cópia de segurança corrigido/reavaliado, sem novos findings; ensaio visual Windows/foco/timer real NOT RUN. Repetição final offline fora da sandbox: 46 PASS; dentro dela: 31 PASS/15 FAIL em backup/recuperação, limite ambiental sem causa precisa isolada, registrado sem enfraquecer testes/controles. Detalhes, arquivos e limites na [evidência](../../.harness/evidence/health-increment/2026-10-08-audit-recovery.md).
- Catálogo: travessia pública TBCA por scripts/tbca-index.py, 60 páginas/5.874 códigos com hashes/cache; composição não coletada/integrada, catálogo do produto continua 88. TACO oficial obtida, 597 linhas de alimentos na folha principal; equivalências e integração pendentes. Autorização da fonte relatada pelo humano, documento não inspecionado. Cache ignorado não acompanha Git.
- Próxima ação exata: continuar T038 importando composição oficial dos códigos, validando unidades/ausências/preparações/proveniência e completude, então demonstrar equivalências/ausências TBCA antes do fallback TACO. Concluir cobertura/ensaios TA-AUD/TA-BKP faltantes e ensaio fictício Windows; Maycon controla integração/distribuição. Nenhum G5/G6/G7 ou aceite clínico inferido.
- Checklist: [x] Discovery/Plan reutilizado; [x] recorte auditoria/backup implementado; [x] testes frontend/Rust/SQLite; [x] review independente estática; [x] índice/catalogação investigativa; [x] checks finais nativos; [ ] composição completa/TACO; [ ] TA-AUD/TA-BKP integrais/visual/aceite; [ ] integração humana. Demais trilhas abaixo preservadas.

## Checkpoint — WEBFIT-5, cadastro mínimo e checks nativos concluídos, 2026-10-09

- Branch/commit-base atual ao continuar: `main` / `538091c4b25b1cba2ff566c885b9bd255c019a68`; base da implementação `3558eddd84211e504ba0457388b1bedc30c9697d`. Avanço externo comunicado; referência local `origin/main` alinhada, sem fetch/consulta remota. Alterações preexistentes em AGENTS.md, ui-review.md, status.md, acceptance-criteria.md, WEBFIT-10/task.md, LoginInfo.tsx e style.css preservadas.
- Autorização: Maycon confirmou número sequencial sem zeros mantendo UUID; “Foi solicitação dela” registra origem funcional de Amanda relatada por Maycon, junto ao pedido de implementação/migração necessária com fixtures. D-PAT-001/003 aceitas; D-PAT-002 preservação do sexo legado provisória não bloqueante. Aceite final separado.
- Última etapa: código de cadastro mínimo/radios/opcionais/número visível e pesquisável implementado; número imediato ao salvar e identidade do rascunho preservada. Migration003/schema3 com snapshot cifrado prévio, transação/FKs/integridade e restore1/2/3 conservando números/contador/licenciamento. Nenhuma base instalada/real migrada por esta sessão.
- Checks: lint/TypeScript/37 Node/build Vite/Prettier PASS; inclui testes da demanda simultânea de backup. Cargo fmt, Clippy all-targets com -D warnings e 46 testes Rust/SQLCipher/DPAPI PASS, inclusive migration/snapshot/rollback/backups1/2/3 e contador da origem. Build Tauri debug sem bundle PASS em `.tools/patient-native-target/debug/webfit-desktop.exe`. Bundle 549,67 kB, warnings PDB OpenSSL/colisão bin-lib/STATIC_VCRUNTIME registrados. Windows visual/teclado/zoom/aceite NOT RUN. Review independente estático em três passagens sem finding funcional concreto; REVIEW PASSED WITH WARNINGS, não READY TO SHIP.
- Documentação: pacote vigente `specs/003-webfit-5-cadastro-paciente/`, requisitos/regras/aceite/casos/matriz, modelo de dados, backup-restauração e decisões atualizados. Evidência/inventário/limites em [plan.md](../../specs/003-webfit-5-cadastro-paciente/plan.md). Histórico de preparação preservado; schema002 pertence ao licenciamento.
- Alterações simultâneas posteriores de auditoria/backup em specs/001, audit_recovery_tests.rs e trechos de lib/service/recovery/App foram identificadas e preservadas; não atribuídas à WEBFIT-5. Não sobrescrever essas alterações para integrar esta entrega.
- Preparação: “Sim” de Maycon autorizou toolchain necessário; encontrado/reutilizado Rust 1.98.1 em `.tools/validation`, PATH/TEMP só do processo, cache de build isolado para não disputar lock de outra demanda. A indisponibilidade inicial foi superada. Somente fixtures, sem abrir base clínica instalada.
- Próxima ação exata: ensaiar três obrigatórios, radios por teclado/leitor de tela/zoom, número sem zeros e migração/restore no Windows com dados fictícios, então aceite humano. Integração/distribuição controladas por Maycon. Reexecutar checks somente se entradas mudarem; não repetir perguntas já respondidas.
- Sincronização/checklist: código/docs locais sem commit/push/publicação, fonte 0.1.10 sem versão distribuída; Plane sync degraded. [x] escopo/autorização/Plan; [x] implementação; [x] checks frontend/SQL Node/SSR; [x] revisão independente estática; [x] checks nativos/fmt/SQLCipher/build Tauri; [ ] ensaio Windows/aceite/integrar. G5 em execução; G6/G7 e demais trilhas preservados.

## Checkpoint — modal mais largo e preferência de layout, 2026-10-08

- Branch/base main/3558eddd84211e504ba0457388b1bedc30c9697d; entrada limpa e main/origin/main alinhados pela referência local, sem fetch. Integração humana anterior reconhecida; captura fornecida mostra piloto 0.1.11-pilot.21.1.
- Última etapa: modal (i) ampliado até 960px, informações/suporte em duas colunas, uma coluna em telas estreitas. Preferência por maximizar conteúdo útil visível/reduzir scroll vertical persistida em AGENTS.md e harness UI Review, preservando legibilidade e rolagem necessária. WEBFIT-10/T-LIC-016/TA-UX-LOGIN-003 e registro atualizados.
- Checks frontend/27 testes/build/format PASS; chunk 547.05 kB WARNING. Rust/nativo sem reexecução (sem alteração backend; Cargo indisponível), ensaio visual Windows/zoom NOT RUN. Revisão independente estática concluída sem findings acionáveis.
- Sincronização: somente alterações locais sem commit/push/publicação. Próxima ação: ensaiar modal integrado em Windows, incluindo zoom/erros/autorizações expandidas; integração pelo fluxo humano. G5 em execução, G6/G7 pendentes. Checklist: [x] implementação/preferência persistida; [x] checks; [ ] ensaio Windows/aceite/distribuição. Demais trilhas preservadas.

## Checkpoint — login livre e janela maximizada, 2026-10-08

- Branch/base: feature/pbi-001-primeiro-incremento-saude, a5204083be2f2049ce3ef6d0970e9456271e45ee; entrada limpa, branch/upstream local alinhados conforme git status. Avanço humano desde 3dc1bd6 preservado; sem fetch/pull ou Git mutável nesta entrega.
- Pedido de Maycon: Licença e suporte no (i), sem atrapalhar login, e abrir em tela cheia (interpretada/comunicada como maximizada com controles nativos). WEBFIT-10/T-LIC-016/017, RF-UX-002/RF-LIC-001/RF-UX-005; requisitos/aceite/matriz atualizados. Instalação preparada mostra suporte no diálogo; destino vazio mantém ativação inicial; ícone fixo no canto. Backend/schema/autorizações preservados.
- Última etapa: implementação e revisão independente concluídas; P2 de fechamento bloqueado após falha inicial corrigido/reavaliado. Checks frontend, formatação, lint, TypeScript, 27 testes e build PASS; aviso de chunk 546.88 kB. Cargo indisponível: build Tauri tentou cargo metadata e falhou por program not found; Rust/SQLite/Clippy NOT RUN. Ensaio Windows/foco/zoom/maximização NOT RUN. Registro/evidência em specs/WEBFIT-10/task.md; Plane sync degraded.
- Sincronização: alterações locais desta entrega sem commit/push/publicação; nenhuma nova versão distribuída. Próxima ação: build nativo no ambiente com Cargo, ensaiar TA-UX-LOGIN-003/TA-UX-WINDOW-001 e integrar pelo fluxo Git humano. Não atribuir estas mudanças ao piloto #19 anterior.
- Checklist: [x] pedido/Plan; [x] implementação/frontend checks; [x] review independente e correção; [ ] build Tauri/ensaios Windows; [ ] integração/distribuição; [ ] aceite. G5 em execução; G6/G7 pendentes. Demais trilhas preservadas.

## Ensaio autorizado de atualização — 2026-10-08

- Maycon relatou neste chat que conseguiu acessar o aplicativo após a ativação. Relato humano, sem inferir aceite integral de WEBFIT-10 ou G5/G6/G7.
- Pedido explícito: preparar atualização, fazer commit e enviar para main para testar a detecção. Branch de trabalho preservada: feature/pbi-001-primeiro-incremento-saude; HEAD de entrada 94be55f. Árvore limpa; main remota consultada em 3030c596201d9d00dfd1629e90a24f20c85cb628, ancestral do HEAD. Envio normal HEAD:main autorizado, sem force ou troca de branch.
- Plano LIGHT: registrar o ensaio neste checkpoint e usar o versionamento existente do pipeline. Base 0.1.10 gera 0.1.11-pilot.<run>.<attempt>, superior ao candidato manual 0.1.10; nenhuma alteração funcional adicional necessária. O envio inclui a entrega de licença/código já integrada à branch.
- Verificação local: 14 testes de preparação de versão, manifesto, assinatura, API de publicação e staging PASS. Revisão documental local; checks completos/build assinado pertencem ao Actions disparado pelo envio. Publicação e detecção no aplicativo ainda não comprovadas neste registro.
- Próxima ação: concluir commit/envio autorizado e acompanhar Actions; após publicação válida, Maycon conferir detecção no aplicativo, confirmar atualização e verificar reinício/acesso/dados fictícios preservados. Não reinstalar manualmente para comprovar detecção automática.
- Resultado Git: commit 3dc1bd6d35490067b951fb197f68c0a497d8aafa enviado com sucesso por HEAD:main, sem force; branch local preservada. origin/main aponta para esse commit; branch local está um commit à frente de seu próprio upstream feature. Run #19 (37866070566), acionado por push nesse SHA, confirmado in_progress pela API GitHub; versão esperada 0.1.11-pilot.19.1. Este resultado pós-envio fica registrado localmente sem novo commit/push para evitar outro piloto apenas pelo registro.
- Checklist: [x] acesso relatado; [x] autorização Git/publicação piloto; [x] verificação de ancestralidade e testes de release; [x] commit/envio; [x] Actions iniciado; [ ] publicação concluída; [ ] detecção/atualização no Windows. G5 em execução; G6/G7 pendentes.

## Checkpoint vigente — WEBFIT-10, ativação por licença e código, 2026-10-08

- Data/branch/HEAD observado ao salvar: 2026-10-08, `feature/pbi-001-primeiro-incremento-saude` / `03c28430b90d990e91db1663375788bdbf959b5d`; upstream `origin/feature/pbi-001-primeiro-incremento-saude`, ahead/behind local 0/0, sem fetch/pull/consulta remota viva ou Git mutável. Árvore limpa na entrada deste salvamento. Avanço humano desde a base de build `e0fb4eae28b69f69cea74c76771e5ca724c96d2a` comunicado antes de editar; commit atual integra a entrega simplificada/documentação. Ao salvar, somente este checkpoint fica modificado; demais trilhas preservadas.
- Última etapa concluída: D-LIC-009 aprovada explicitamente (licença/código juntos, reutilização entre máquinas offline aceita); T-LIC-012..015 implementadas/checks locais. INITIAL portátil v2, emissor sem request, tela licença/código e preparação do profissional; administrador definido pela licença. V1/demais operações/schema/cofre/DPAPI preservados.
- Verificação: 29 Rust produto + 3 protocolo + 3 emissor e 24 Node PASS; lint/TS/frontend builds/fmt/Prettier/Clippy/diff PASS. Metadados finais clínico 0.1.10/emissor 0.1.1 e builds Tauri clínico NSIS/emissor debug PASS. NSIS primeiro bloqueado por DNS, retry ampliado autorizado concluído, inclui instalador offline WebView2. Sem instalação/abertura de banco/cofre reais/publicação/assinatura de release.
- Artefatos: `.artifacts/mvp/2026-10-08/activation-code-0.1.10/` (instalador/roteiro/manifest SHA-256) e `activation-code-emissor-0.1.1/` (ferramenta/roteiro exclusivo). Licença/código reais ainda não gerados pelo agente. [Evidência/inventário](../../specs/WEBFIT-10/task.md#entrega-simplificada-concluída-localmente), [manual](../../tools/license-issuer/README.md).
- Conferência deste salvamento: dois executáveis presentes e hashes SHA-256 iguais ao manifest da compilação anterior; testes/builds referenciados, não reexecutados para documentação. Artefatos em `.artifacts/` são ignorados pelo Git e não acompanham clone/pull: preservar/copiar os candidatos ou recompilar ao trocar de máquina. Cofre do emissor é separado do repositório/instalador; recuperação em outra máquina exige backup protegido pelo fluxo humano, nunca cópia do banco ativo ou solicitação de segredo no chat.
- Orientação de credenciais esclarecida neste chat: senha administrativa é definida em **Sua senha administrativa para esta licença**, no emissor, e guardada em item separado do Bitwarden; senha de recuperação do cofre serve ao backup do emissor; código de ativação é enviado à nutricionista e não é senha de login. Maycon perguntou se era a senha já salva; não confirmou geração da licença/código ou custódia da nova senha administrativa. Export público informado/capturado anteriormente; conclusão do backup protegido do emissor não confirmada.
- Próxima ação exata: Maycon abrir `WebFit-Emissor-0.1.1-teste.exe` no mesmo usuário Windows do cofre; em **Ativação inicial sem solicitação**, definir/guardar login e senha administrativa no Bitwarden, confirmar e **Gerar licença e código de ativação**; salvar `.webfit-license` e copiar/guardar código antes de fechar. Enviar somente licença/código, `WebFit-Desktop-0.1.10-teste-x64.exe` e roteiro à nutricionista para teste fictício em destino vazio (outro computador/VM escolhido por Maycon). Ela seleciona licença, informa código e prepara seu acesso/backup. Ensaio Windows/teclado/visual e revisão independente pendentes; não enviar senha administrativa/emissor/cofre/backup privado. Banco legado não é apagado para ativar.
- Checklist: [x] decisão/requisitos/Plan; [x] protocolo/backend/emissor/UI/testes; [x] builds e documentação; [x] integração humana observada no HEAD atual; [x] artefatos/hashes e checkpoint conferidos; [ ] acesso administrativo guardado/licença/código por Maycon; [ ] backup protegido do emissor confirmado; [ ] ensaio fictício Windows; [ ] review independente/aceite final; [ ] integração humana deste salvamento. Autorrevisão concluída, sem READY TO SHIP/Done; Plane sync degraded; G5 em execução, G6/G7 e demais trilhas preservados. Painel/serviço online adiados. Resultado de Actions/publicação no commit atual não consultado nem inferido.

## Checkpoint salvo — encerramento desta sessão, 2026-10-08

- **Data/branch/HEAD:** 2026-10-08; `feature/pbi-001-primeiro-incremento-saude`; commit-base observado `3030c596201d9d00dfd1629e90a24f20c85cb628`. Branch diferente da `main` registrada na correção anterior; divergência informada antes desta edição. Nenhuma criação/troca de branch pelo agente.
- **Sincronização:** upstream `origin/feature/pbi-001-primeiro-incremento-saude`, contagem local ahead/behind 0/0; árvore limpa na entrada. Referências locais conferidas sem fetch/pull ou consulta ao remoto vivo. Ao salvar, somente este checkpoint ficou modificado e sem commit; integração Git permanece com Maycon.
- **Última etapa técnica concluída:** correção de formatação de license.rs/service.rs incluída no commit atual (`style: format Rust files with cargo fmt to satisfy CI checks`), confirmada por inspeção do commit. `cargo fmt --manifest-path src-tauri/Cargo.toml --check` passou novamente neste HEAD. A pendência de integrar a correção no checkout foi superada; sucesso de um novo Actions não foi consultado nem inferido.
- **Interface:** V01–V08 implementados conforme registros existentes; revisão independente/ensaio Windows/aceite continuam pendentes. Levantamento seguinte concluído com cobertura visual parcial e cinco candidatos propostos, sem implementação: [relatório](../../.impeccable/critique/2026-10-08T22-48-16Z_src-app-tsx.md). Recorte recomendado N01/N03, preservação das edições e clareza das metas na prescrição; N02 exige conciliação com requisitos clínicos. Acesso clínico no banco legado segue limitado pela ativação, sem autorização para bypass ou limpeza.
- **Próxima ação exata:** conferir o resultado do Actions que use o commit corrigido `3030c596201d9d00dfd1629e90a24f20c85cb628` ou seu descendente; não repetir o commit anterior à formatação. Depois retomar a escolha do recorte N01/N03 pelo fluxo vigente, investigando N02 e preparando ensaio fictício licenciado conforme WEBFIT-10. Este pedido de salvar não autoriza iniciar essa implementação, mudar licença/banco ou publicar.
- **Checklist vigente:** [x] correção integrada no commit observado; [x] fmt check local; [x] checkpoint/branch/upstream conferidos; [ ] resultado Actions no commit corrigido; [ ] escolha/execução do próximo recorte; [ ] revisão independente e ensaios Windows/aceite das entregas existentes; [ ] integração humana deste checkpoint. G5 segue em execução, G6/G7 não concluídos; aprovações e próximas ações das demais trilhas abaixo preservadas. Registros anteriores de branch/base e integração pendente são históricos em relação a esta conferência.

## Correção LIGHT — cargo fmt do Actions, 2026-10-08

- Data/branch/commit-base: 2026-10-08, main, 8cd095fc0a4a917c2039eb84df88138df92218e7; árvore limpa na entrada. Avanço humano desde a base da auditoria reconhecido; demais trilhas preservadas. Sem fetch/pull, commit/push ou publicação pelo agente.
- Origem/escopo: Maycon anexou falha do Actions em `cargo fmt --manifest-path src-tauri/Cargo.toml --check`. Falha reproduzida localmente (exit 1), exclusivamente em src-tauri/src/license.rs e src-tauri/src/service.rs. Plan inline LIGHT: aplicar rustfmt e revisar o diff; nenhum comportamento, SQL, schema, dependência ou configuração de CI alterado.
- Última etapa concluída: formatação aplicada aos dois arquivos; mesmo check passou (exit 0), assim como git diff --check. Autorrevisão do diff confirma somente layout e vírgulas finais de chamadas. Revisão independente não realizada; testes funcionais/build não reexecutados por se tratar de formatação mecânica sem mudança de comportamento. Não comprova sucesso das etapas posteriores do Actions.
- Próxima ação exata: Maycon integrar/enviar os dois arquivos formatados e este checkpoint pelo seu fluxo Git; executar o Actions no novo commit, pois rerun do commit antigo mantém a falha. Sincronização local HEAD/origin/main conferida sem consultar remoto vivo; aceite e gates das demais demandas mantidos.
- Checklist: [x] reprodução; [x] formatação; [x] fmt check e diff; [ ] integração Git humana; [ ] Actions no novo commit. G5 em execução, G6/G7 não concluídos. Registro LIGHT local, sem novo Plane/spec.

## Levantamento agendado — próximo recorte de interface, 2026-10-08

- Data/branch/commit-base: 2026-10-08, main, 680fad5616d54a895dbecc6702595a1b5d232cfd; HEAD/origin/main local 0/0, sem fetch/pull/Git mutável. Implementações V01–V08 e demais alterações locais preservadas; não integradas nesse HEAD.
- Última etapa: avaliação independente dupla e síntese com acesso nativo ao candidato e prévias isoladas dos componentes atuais. Login fictício funcionou; proteção de banco legado/ativação limitou telas clínicas. Piloto anterior fechou com exceção Windows 0xc0000409, causa raiz não comprovada. Não houve bypass, limpeza, instalação ou alteração de produto por este levantamento.
- Evidência e resultado: [relatório do próximo recorte](../../.impeccable/critique/2026-10-08T22-48-16Z_src-app-tsx.md). V01–V08 não reabertos; apresentação parcial confirmada e ensaios nativos pendentes preservados. Cinco candidatos novos (dois P1, três P2), todos propostas; fonte/visual/limites diferenciados. Detector [], executado uma vez. Nenhuma nova spec/Plane ou aprovação de produto.
- Próxima ação exata: priorizar N01/N03 (preservar edições e distinguir metas aplicadas na prescrição), investigar N02 (estado inicial) com RF-PRE-005/TA-PRE-008. Depois N04/N05; ensaio clínico depende de candidato licenciado fictício pelo fluxo WEBFIT-10, sem apagar banco legado. Não repetir automaticamente esta auditoria.
- Checklist: [x] retomada/contexto e preservação; [x] autenticação fictícia; [x] evidência nativa limitada e prévias renderizadas; [x] avaliações independentes/síntese; [ ] ensaio clínico nativo/licença; [ ] API lenta/erros/teclado/NVDA/200%; [ ] escolha/execução/aceite do próximo recorte. G5 em execução; G6/G7 e demais trilhas preservados.

## Checkpoint vigente — V05 / WEBFIT-13, 2026-10-08

- Data/branch/commit-base: 2026-10-08, main, 680fad5616d54a895dbecc6702595a1b5d232cfd; upstream local 0/0, sem fetch/pull. Trabalho preexistente e sete ajustes anteriores preservados; sem Git mutável/instalação/publicação/schema/dependência.
- Última etapa: Maycon aprovou saída neutra recomendada (“Faça isso”), D-DRF-EXIT-001 ACCEPTED; V05 implementada. Oito specs têm código local; sem decisão funcional bloqueante restante no lote. Voltar/Escape sem gravação/exclusão/aplicação; paciente/perfil lista, prescrição paciente; clique externo inerte; foco no título após carga do contexto.
- Verificação: lint/TS/24 Node/build Vite/formatação/detector [] PASS; três novos testes de handlers/preservação/destinos. Rust/SQLite 28/28 e fmt/clippy anteriores reutilizados sem mudança backend; build Tauri final PASS (release sem bundle, 1m41s). Ensaio DOM/WebView/reentrada/reinício/teclado/NVDA/200% e revisão independente pendentes. Evidência: [V05](../../specs/ui-audit-2026-10-08/V05-saida-recuperacao/spec.md), [índice](../../specs/ui-audit-2026-10-08/README.md#v05--webfit-13--aprovação-e-execução-posterior).
- Próxima ação exata: Maycon obter revisão independente e ensaiar os oito refinamentos no candidato integrado pelo fluxo humano; conferir preservação e oferta do mesmo rascunho após Voltar/Escape e reentrada/reinício. Nenhuma nova decisão V05 necessária.
- Checklist: [x] decisão explícita; [x] implementação/testes/contratos documentados; [x] build Tauri final; [ ] review independente; [ ] ensaio Windows/aceite; [ ] G5. G5 em execução, G6/G7 pendentes. Demais trilhas preservadas; checkpoint anterior abaixo é histórico nesta trilha.

## Checkpoint anterior — execução V01–V08, 2026-10-08

- Data/branch/commit-base: 2026-10-08, main, 680fad5616d54a895dbecc6702595a1b5d232cfd; HEAD/origin/main local 0/0, sem fetch/pull/consulta remota viva. Árvore preexistente WEBFIT-8/10/11/ativação/docs preservada; sem Git mutável/publicação/instalação/dependência/schema.
- Última etapa concluída: sete specs implementadas localmente; V03 WEBFIT-12, V05 WEBFIT-13 Blocked por saída neutra indefinida. Autorrevisão e checks/SSR concluídos; revisão independente e ensaio visual/nativo pendentes. Registro/evidência/pendências por item no [índice](../../specs/ui-audit-2026-10-08/README.md#execução-sequencial--2026-10-08), sem specs concorrentes.
- Verificação: lint/TS/format, 21 Node (3 regressões), 28 Rust/SQLite com TEMP isolado, clippy, detector [] e build Vite/Tauri sem bundle; resultado final Tauri PASS. Rust TEMP padrão falhou 7 STORAGE, isolado passou; warnings chunk/cache/PDB. SSR 28 asserções PASS; não comprova UI/foco/envio Windows. Fonte 0.1.8 inalterada, instalado 0.1.9-pilot.16.1 preservado.
- Próxima ação exata: Maycon decidir V05 (manter binário ou permitir Voltar com destinos/Escape), obter revisão independente das sete implementações e ensaiar erros/saída/recuperação/teclado/NVDA/200% no candidato integrado pelo fluxo humano. WEBFIT-5 continua pendente separadamente, não antecipada por V02.
- Checklist: [x] escopo/preservação; [x] sete implementações e checks locais; [x] bloqueio V05/decisões provisórias registrados; [ ] revisão independente; [ ] medição V04 e ensaio Windows/aceite dos demais critérios; [ ] decisão/execução V05; [ ] aceite final/G5. G5 em execução; G6/G7 não concluídos; demais trilhas abaixo mantidas.

## Auditoria visual — piloto atual, 2026-10-08

- Data/branch/commit-base: 2026-10-08, main, 680fad5616d54a895dbecc6702595a1b5d232cfd. Git somente leitura; sem fetch/pull/commit/push. Alterações preexistentes WEBFIT-8/10/11 e ativação offline preservadas; sincronização remota não consultada nesta auditoria.
- Última etapa concluída: critique/audit com duas avaliações independentes e 16 capturas do aplicativo instalado 0.1.9-pilot.16.1. UX26/40, técnica13/20; oito achados (um P1, sete P2), detalhados na [evidência](../../.harness/evidence/ui-audit/2026-10-08-pilot-16.md). Detector do source de comparação retornou zero achados. Código/banco/dependências não alterados por esta entrega.
- Verificado nesta sessão: telas acessadas nativamente, recuperação do preenchimento preexistente sem edição, Escape impedido nesse modal, recolher/reabrir menu e foco observável por Tab. Maycon autenticou; nenhum cadastro salvo/descartado ou backup/restauração/update manual acionado. Aplicativo devolvido à lista com menu aberto.
- Registro posterior pedido por Maycon: oito specs individuais V01–V08 criadas como **PENDENTE — resolução adiada**, no [índice das pendências](../../specs/ui-audit-2026-10-08/README.md). Entrega LIGHT documental, sem Work Items Plane ou aprovação de novos requisitos; critérios propostos e dependências WEBFIT-5/7/8/10 preservados. Branch/commit-base acima mantidos; HEAD/origin/main local 0/0, sem consulta ao remoto vivo. Nenhuma implementação nesta etapa.
- Próxima ação desta trilha: escolher um item V01–V08 para retomada, revalidar o achado na versão integrada e executar somente o escopo autorizado pelo fluxo vigente. V05 depende de decisão sobre saída neutra; V01 precisa comparar os ajustes locais posteriores. Completar prescrição/validações/NVDA/200% em ensaio fictício; sem inferir aceite das demais demandas.
- Checklist: [x] versão/contexto e preservação; [x] inspeção visual/evidência e avaliações independentes da auditoria; [x] oito specs pendentes com critérios/dependências e revisão documental; [ ] revisão independente do lote documental; [ ] envio/erros e prescrição nativos; [ ] 1366×768/200% e fluxo integral por teclado; [ ] priorização/correções/aceite humano. G5 em execução, G6/G7 não concluídos. As próximas ações WEBFIT-8/10/11 abaixo permanecem vigentes; auditoria e registro não implementam nem aceitam essas entregas.

## Checkpoint complementar — WEBFIT-8, ícone da barra, 2026-10-08

- Data/branch/commit-base: 2026-10-08, main/680fad5616d54a895dbecc6702595a1b5d232cfd; sincronização local HEAD/origin/main 0/0, sem fetch/pull. Avanço humano desde a base histórica e07cdc8 reconhecido; documentos WEBFIT-10/11 já modificados preservados. Nenhuma operação Git mutável, publicação ou instalação.
- Última etapa concluída: definição explícita de ICON_BIG no setup Windows com recurso Tauri, para RF-UX-004/TA-UX-BRAND-002. Executável instalado já contém seis payloads da marca; atalho Desktop aponta para ele. Cache do shell é hipótese, sem confirmação. Fonte/versão/identificador/banco preservados.
- Verificação: formatação, lint/TypeScript/18 Node/build Vite, 19 Rust/SQLite, clippy e compilação Tauri release PASS. Teste Windows isolado associa ícone a janela oculta; não executa produto no host. Inspeção novo PE seis/seis PASS. Resultado final NSIS e limitações em [.harness/evidence/webfit-8/verification.md](../../.harness/evidence/webfit-8/verification.md).
- Próxima ação exata: Maycon revisar/integrar pelo fluxo Git e gerar piloto atualizado contendo T009, conferir abertura pelo atalho Desktop/barra/Alt+Tab e obter review independente/aceite visual. Build local 0.1.8 é só evidência e não deve substituir instalado 0.1.9-pilot.16.1.
- Checklist: [x] escopo RF-UX-004 reutilizado; [x] correção e checks locais; [ ] review independente; [ ] ensaio visual do piloto atualizado; [ ] aceite final. WEBFIT-10/11/demais próximas ações permanecem como abaixo; G5 em execução, G6/G7 não concluídos.

## Onde paramos

### Checkpoint — WEBFIT-11, cache de compilação do piloto, 2026-10-08

**Checkpoint vigente após medição:** 2026-10-08, main, HEAD 680fad5616d54a895dbecc6702595a1b5d232cfd, upstream local 0/0 sem fetch/pull; entrada limpa. Commit/push do ensaio especificamente autorizados e realizados anteriormente; esta coleta apenas atualiza task.md e status.md localmente. Run #16 success no DESKTOP-GEUP094: fila até o job 3s, job 6m14s; Clippy 20s, Rust/SQLite 38s, build assinado 3m30s, verificação pública PASS. Contra #15 (35m47s): menos 29m33s, redução observada de 82,58%. Evidência/API/limites no [registro](../../specs/WEBFIT-11/task.md). Última etapa: ensaio aquecido concluído e monitoramento encerrado. Próxima ação: aceite humano da WEBFIT-11/D-CI-011; Maycon pode integrar este registro pelo fluxo Git, sem nova publicação pelo agente. Checklist vigente: [x] integração; [x] publicação/permissões/medição real neste runner; [ ] aceite final humano. Os bullets abaixo retratam a entrega anterior, agora histórica; demais trilhas/gates preservados. Não garantir o mesmo tempo em builds futuros.

**Ensaio posterior autorizado:** Maycon pediu explicitamente commit/push na main e publicação para medir. Entrada limpa no HEAD f6a8d7a30b81fcc4514394634685b92984ecfbfd, implementação já integrada. Run #15 passou no runner DESKTOP-GEUP094: job 35m47s (Clippy 13m49s, testes 3m06s, build 16m44s), preenchendo o cache. Novo commit documental/push autorizado dispara ensaio aquecido; comparar duração do job, excluindo fila. Resultado pendente, sem aceite de desempenho inferido; evidência no registro WEBFIT-11. As referências anteriores a NSIS/serviço NOT RUN passam a históricas para esse runner após o sucesso #15.

- **Data, branch e commit-base:** 2026-10-08, main, 7556edeb78378fa08dcf0332df072217a10aa11b, observados localmente; checkpoints anteriores preservados como históricos/trilhas próprias.
- **Sincronização:** HEAD/origin/main local 0/0, sem fetch/pull; entrada limpa, oito owners desta demanda alterados/criado sem commit. Plane WEBFIT-11 criado uma vez após busca sem correspondente, módulo Fundação, prioridade neutra, encaminhado a Review. Sem Git mutável/publicação/dependências.
- **Última etapa concluída:** quatro fases STRICT no escopo pedido: cache Cargo persistente fora do checkout e staging usando mesmo target, com fallback local. Checks/assinatura/SQLCipher/perfil release preservados. 33 testes Node incluindo Cargo offline, staging 2/2 final, metadata real externo, Rust fmt e frontend format/lint/typecheck/18 testes/build PASS. Review independente sem bloqueador; REVIEW PASSED WITH WARNINGS, READY TO SHIP para integração humana. Evidência/inventário: [registro único](../../specs/WEBFIT-11/task.md).
- **Próxima ação exata:** Maycon revisar/integrar a alteração pelo fluxo Git e medir pelo menos dois jobs no mesmo runner; primeiro cache frio, seguinte aquecido. Confirmar permissão da conta do serviço e build NSIS assinado. Ganho em minutos/SQLCipher real NOT RUN, sem promessa de duração. D-CI-011 aguarda validação no aceite final.
- **Checklist:** [x] pedido/Plane/Discovery/Plan; [x] implementação/testes/documentação; [x] review independente; [ ] aceite humano; [ ] integração/publicação e medição cold/warm pelo usuário. G5 segue em execução; G6/G7 e demais trilhas preservados.

### Checkpoint — WEBFIT-10, ativação offline, 2026-10-08

**Continuação — candidato configurado para ensaio, 2026-10-08:** Maycon informou o export público em Downloads após captura da ferramenta. Validação confirmou uma chave pública de 32 bytes idêntica à configuração já presente; sem sobrescrita/acesso a segredo. Build Tauri release sem bundle PASS (TypeScript/Vite e Cargo 2m06s); cópia de teste em `.artifacts/licensing-test/2026-10-08/WebFit-ativacao-configurada-0.1.8.exe`. Branch/base main/680fad5616d54a895dbecc6702595a1b5d232cfd, upstream local 0/0 sem fetch; alterações paralelas preservadas, sem Git mutável/instalação/banco/publicação. Próxima ação exata desta trilha: Maycon escolher ambiente vazio (outro usuário Windows/VM/computador) e ensaiar solicitação → emissão → importação → preparação → login administrativo/profissional com dados fictícios. Checklist: [x] pública conferida/candidato configurado; [ ] backup protegido do emissor confirmado; [ ] ativação e ensaios dos cinco fluxos; [ ] revisão independente/aceite. Histórico abaixo retrata candidato anterior sem confiança; demais trilhas/G5/G6/G7 preservados. Evidência no [registro único](../../specs/WEBFIT-10/task.md#preparação-do-candidato-configurado--2026-10-08).

- **Data/branch/commit-base:** 2026-10-08, main, 680fad5616d54a895dbecc6702595a1b5d232cfd. Upstream local 0/0, sem fetch/pull/Git mutável. Trabalho WEBFIT-8/11 e demais trilhas preservado.
- **Autoridade:** Maycon respondeu “Aprovo a implementação” após pacote técnico/D-LIC-006..008. ADR-0003 v1/dependências/schema/restauração/legado e inventário P-LIC-001 ACCEPTED; não repetir decisões respondidas.
- **Última etapa concluída:** implementação local dos cinco tipos, protocolo Ed25519/sealed box, migração 002/consumo transacional, emissor separado com cofre DPAPI/SQLCipher recuperável, setup sem senha admin escolhida no clínico, restore mantendo credenciais/consumo do destino, suporte de sessão até 4 h e reset com backup mantendo acessos/perfil/licença/auditoria. Pacote por cópia adiado. [Inventário/evidência único](../../specs/WEBFIT-10/task.md), [operação do emissor](../../tools/license-issuer/README.md).
- **Verificação:** 28 testes produto Rust/SQLite + 2 protocolo + 2 emissor e 18 Node PASS, mais revalidação do reset com perfil/rascunho/auditoria. TS/lint/formatação/Clippy/builds frontend PASS; Windows Tauri release clínico e executável debug separado do emissor PASS, sem NSIS/instalação/publicação. Autorrevisão realizada; browser de fixture não anexou, visual e review independente NOT RUN. Limites/warnings e comandos no registro. Sem READY TO SHIP ou Done.
- **Próxima ação exata:** review independente e ensaio Windows dos cinco fluxos com fixtures. Maycon criar sua identidade/cofre e backup protegido na ferramenta, exportar/integrar somente a pública em src-tauri/license-trust.json pelo seu Git/build e preparar candidato configurado. Confiança versionada vazia recusa ativação; não distribuir este candidato vazio nem substituir piloto instalado por build local 0.1.8. Depois aceite/gates aplicáveis. Sem dados reais/G7.
- **Checklist:** [x] Discovery/Plan/adoção técnica; [x] implementação/checks/documentação/autorrevisão; [ ] review independente; [ ] ensaio visual/instalador Windows; [ ] confiança real/candidato configurado pelo humano; [ ] aceite final. Plane Review, prioridade neutra/Fundação preservados. G5 em execução, G6/G7 não concluídos.

### Manutenção — harness de quatro fases, 2026-10-08

- **Data, branch e commit-base:** 2026-10-08, main, e07cdc8300de0421dbdc7fd64aafe7d30a191e80, observados localmente.
- **Sincronização:** HEAD/origin/main local 0/0, sem fetch/pull ou consulta ao remoto vivo. Trabalho preexistente de produto/WEBFIT-6/8/9 e manutenção AGENTS preservado; WEBFIT-7/DraftRecoveryDialog surgiram em paralelo na conferência final, sem edição por esta manutenção. Sem Git mutável/publicação.
- **Última etapa concluída:** refatoração documental autorizada por Maycon (DEC-057): Discovery → Plan → Execução → Code Review, níveis de profundidade, Scope Check/avanço contínuo, Spec Kit opcional e registro único proporcional. Constitution 2.0.0 e contratos alinhados; produto/banco/dependências e oficiais/históricos preservados. Evidência: [workflow de quatro fases](../../.harness/evidence/2026-10-08-four-phase-workflow.md).
- **Próxima ação exata desta manutenção:** nenhum trabalho documental pendente desta refatoração; Maycon revisa/integra os 35 owners pelo seu fluxo Git e usa webfit-task com quatro fases no próximo uso real. Demais trilhas abaixo mantêm suas próprias próximas ações/aprovações; este processo novo não aceita decisões de produto pendentes.
- **Checklist:** [x] pedido/escopo e refatoração documental; [x] três skills locais validadas; [x] coerência estática A–H; [x] 124 links/10 âncoras/diff sem erros; [x] revisão independente e correção reavaliada, sem finding novo; [ ] aceite final e integração Git humanos. READY TO SHIP documental com limitações estáticas explícitas; G5 em execução; G6/G7 não concluídos. Sem execução real dos cenários de produto ou publicação.

### Checkpoint — WEBFIT-9, faixa compacta e detecção durante uso, 2026-10-08

- **Data, branch e commit-base:** 2026-10-08, main, e07cdc8300de0421dbdc7fd64aafe7d30a191e80, observados localmente.
- **Sincronização:** HEAD/origin/main local 0/0 sem fetch/pull. Alterações WEBFIT-6, WEBFIT-8 e manutenção AGENTS preservadas; esta demanda compartilha App/CSS/docs sem substituir branding. Sem Git mutável/publicação.
- **Última etapa concluída:** implementação autorizada por Maycon após análise; RF-UPD-001/TA-UPD-UI-003..006, specs/006-webfit-9-faixa-atualizacao/. Consulta no login/30min/retorno, faixa global curta com aviso de salvar/reiniciar, detalhes recolhidos, Atualizar à direita e bloqueios existentes. Formatação/lint/TypeScript/build frontend, 18 testes frontend e 18 Rust/SQLite PASS (TEMP de teste no workspace). Review independente corrigiu atraso de timer após foco; revalidação 8/8 PASS. Evidence em .harness/evidence/webfit-9/.
- **Próxima ação exata:** Maycon revisa/integra pelo seu fluxo Git e ensaia versão Windows distribuída, faixa/edição/adiar/teclado/zoom/scroll e detecção durante sessão. Build Tauri sem bundle PASS (2m40s), sem instalador/publicação. D-UPD9-001 (cooldown/adiamento por versão) aguarda validação no aceite final. Ferramenta de browser não abriu fixture local, sem aprovação visual inferida. WEBFIT-9 encaminhada a Review.
- **Checklist do Gate:** [x] pedido/proposta e implementação autorizados; [x] Plane/Spec/Plan/Tasks/Analyze; [x] código/checks/Converge/Verification/Review independentes; [x] build Tauri final registrado; [ ] UI Windows/zoom/ensaio de distribuição; [ ] decisão provisória/aceite final. G5 em execução, G6/G7 preservados.

Os checkpoints abaixo mantêm suas próprias próximas ações; esta entrega não aceita nem cancela demandas paralelas.

### Checkpoint — WEBFIT-8, identidade visual, 2026-10-08

- **Data, branch e commit-base:** 2026-10-08, main, e07cdc8300de0421dbdc7fd64aafe7d30a191e80.
- **Sincronização:** upstream local 0/0 sem fetch/pull; alterações WEBFIT-6 preexistentes e manutenção AGENTS/WEBFIT-9 surgidas durante execução preservadas. Sem Git mutável/publicação/instalação pelo agente.
- **Última etapa concluída:** símbolo sem texto aplicado por RF-UX-004/DEC-056, Spec/Plan/Tasks/Analyze/Implement/Converge e checks/recursos locais. Fonte em public/brand/webfit-icon.png; interface e recursos Tauri/NSIS usam mesma marca. Evidência: .harness/evidence/webfit-8/evidence.md.
- **Próxima ação exata da demanda:** Maycon integra/distribui pelo seu fluxo Git, obtém review independente e confere logo na instalação Windows atualizada. Pacote local valida identidade, não representa versão final das demandas paralelas. G5/G6/G7 e próximas ações das demais trilhas preservados.
- **Checklist do Gate:** [x] escopo/aplicação local solicitados; [x] requisitos/Spec/Plan/Tasks/Analyze; [x] implementação e recursos PE/ICO/build Windows; [x] checks proporcionais/documentação; [ ] review independente; [ ] ensaio visual Windows/aceite final. CUA não abriu prévia; não inferir aceite.

### Manutenção documental — AGENTS.md, 2026-10-08

- **Data, branch e commit-base:** 2026-10-08, `main`, `e07cdc8300de0421dbdc7fd64aafe7d30a191e80`, observados localmente.
- **Sincronização:** alterações locais preexistentes preservadas; sem fetch/pull, commit/push ou consulta ao remoto vivo nesta manutenção.
- **Última etapa concluída:** mesclagem LIGHT autorizada por Maycon, incorporando colaboração e qualidade ao AGENTS.md e preservando decisões, autoridades e gates. Evidência: [mesclagem](../../.harness/evidence/2026-10-08-agents-merge.md).
- **Próxima ação exata desta manutenção:** nenhuma implementação pendente; integração Git sob controle de Maycon. As próximas ações de produto registradas nas respectivas trilhas permanecem vigentes.
- **Checklist do Gate:** [x] fonte e edição documental; [x] revisão de consistência e checks documentais; G5 em execução, G6/G7 não concluídos. Nenhum gate de produto aprovado por esta manutenção.

### Checkpoint vigente desta sessão — WEBFIT-6, 2026-10-08

Maycon solicitou o ícone (i) do login em todas as telas, no canto inferior direito. STANDARD registrada como WEBFIT-6; Specification/Plan/Tasks/Analyze preparados em specs/004-webfit-6-informacoes-globais/, evidência .harness/evidence/webfit-6/planning.md. Produto ainda não alterado. D-INFO-001 propõe informações e Fechar durante sessão, mantendo Acesso do administrador no login; pergunta apresentada, validação não inferida. Gate da demanda: Human Decision Review e Implementation Approval pendentes. G5 segue em execução por DEC-045; G6/G7 não concluídos.

- **Data:** 2026-10-08.
- **Branch e commit-base:** main, e07cdc8300de0421dbdc7fd64aafe7d30a191e80, observados por leitura local.
- **Sincronização:** main/origin/main 0/0, sem fetch/pull; árvore limpa na entrada, agora artefatos locais desta demanda sem commit. Git permanece sob Maycon/DEC-054.
- **Última etapa concluída:** planejamento/análise e checks documentais; nenhuma implementação.
- **Próxima ação exata da demanda:** Maycon valida D-INFO-001 e autoriza o plano de WEBFIT-6; depois executar T001..T008, incluindo UI/teclado/zoom/preservação de formulários, checks, Converge, Verification/Review/Evidence e aceite final.
- **Checklist do Gate:** [x] investigação/Plane/Spec/Plan/Tasks/Analyze; [x] links/formato/diffcheck; [ ] decisão e implementação autorizadas; [ ] implementação e checks; [ ] Review/UI/aceite final.

Os registros abaixo permanecem como contexto das trilhas anteriores. HEAD anterior 23c2823 e pendências de integração são históricos; o HEAD atual posterior não comprova por si só sucesso do pipeline, updater ou aprovação de WEBFIT-5. Nenhuma demanda anterior foi alterada no Plane nesta sessão.

Atualização mais recente: Maycon integrou correções anteriores; HEAD 23c2823. Run #11 construiu/assinou, mas parou no primeiro upload: GitHub retorna URL temporária untagged enquanto draft; validador exigia URL definitiva cedo demais. Correção local aceita URL temporária restrita ao mesmo host/repositório/nome, mantendo checagem de tamanho/estado e verificação pública posterior. 30 testes, sintaxe e diffcheck PASS. Próxima ação exata: Maycon integrar reparo de publication-api.mjs/testes e documentação na main, executar pipeline no novo commit; não rerun #11 antigo. Draft 406286247 preservado, nenhuma nova publicação executada. As referências abaixo à integração pendente das correções anteriores são históricas; esta correção incremental ainda está sem commit.

- **Data do checkpoint:** 2026-10-07
- **Fase:** G5 em execução — construção do primeiro incremento de Saúde
- **Gate atual:** G4 aprovado em 2026-09-21; execução G5 autorizada por DEC-045 em 2026-10-06; G5/G6/G7 não concluídos
- **Estado:** G5 em execução com dados fictícios. Rerun #10 autorizado publicou piloto 0.1.9-pilot.10.2, mas a verificação pública falhou: manifesto aponta para instalador com espaço no nome e GitHub publicou nome com ponto. Atualização ainda NOT READY. Correções locais de preflight, nome ASCII e validação de uploads passaram em 30 testes e revisão independente. Runner/Perl do notebook instalados/verificados; registro falhou HTTP 404, conexão/build real pendentes. WEBFIT-5 permanece em Decision Review, com validação funcional conjunta e execução pendentes.
- **Última etapa concluída:** manifesto público baixado sem credenciais e divergência de nome confirmada; correção local usa WebFit-Desktop_<versão>_x64-setup.exe e valida retorno do upload antes de publicar. 30 testes e revisão independente passaram. README remoto criado sob autorização específica, commit 1a9838a6228c278f23f8f5c811557bb43a4b1ef4 confirmado em main do repositório de releases. Helpers locais de registro privado do notebook preparados. O planejamento WEBFIT-5 e os checks anteriores de Auditoria permanecem preservados.
- **Última etapa técnica anterior:** repositório `Maycon-bd/webfit-desktop-releases` criado, `WEBFIT_RELEASE_TOKEN` informado como cadastrado, runner Windows `DESKTOP-GEUP094` instalado em `C:\actions-runner` e testado manualmente com `Connected to GitHub`/`Listening for Jobs`; o erro 1068 do serviço foi resolvido pela correção para `NT AUTHORITY\NetworkService`; Maycon confirmou `RUNNING` após reiniciar o Windows; nenhum segredo foi versionado no Git
- **Próxima ação:** Maycon revisa/integra correções locais pelo seu fluxo Git; validar uma nova execução no commit corrigido e depois ensaiar duas versões fictícias. Reexecutar o run antigo usa o código antigo. Piloto público atual preservado, sem recuperação ou novo rerun automático. Para o notebook, obter novo token temporário no repositório correto e executar helper privado, depois conferir Listening for Jobs/Idle. WEBFIT-5 permanece aguardando validação responsável opcional/sexo legado, aprovação funcional de Amanda e execução do plano.
- **Branch registrada:** main (observada em 2026-10-07; mudança humana em relação ao checkpoint feature/pbi-001, Git sob controle de Maycon/DEC-054).
- **Work Item:** `WEBFIT-5` — cadastro mínimo em Decision Review; `WEBFIT-4` segue com aceite final pendente; `WEBFIT-3` é vínculo legado G4 em Done.
- **Commit-base / HEAD observado:** 23c2823d855752fb6face2fb76d0a9731084a157.
- **Sincronização:** main e referência local origin/main com contagem 0/0; árvore limpa no início, agora alterações locais de scripts/workflow/documentação do updater sem commit. WEBFIT-5 já recebido no commit atual; descrição anterior de documentos sem commit era histórica. Nenhum fetch/pull/commit/push no repositório de produto nesta retomada. Exceções externas especificamente autorizadas por Maycon: README no repositório de artefatos e rerun #10 para publicar somente piloto fictício. Rerun acionado uma vez: piloto publicado, verificação pública falhou; correção local pendente de integração humana.

## Última decisão aprovada

Amanda e Maycon aprovaram em 2026-09-17 D-AUTO-001/002 e a baseline da auditoria; Maycon aprovou em 2026-09-10 a consulta da auditoria:

- filtros por período, usuário, ação, tipo de entidade e resultado, combinados por AND;
- ordenação fixa do mais recente para o mais antigo;
- paginação no backend com 50 registros por página;
- período inicial de 30 dias, com instantes UTC e fronteiras determinísticas;
- catálogos controlados e resultados SUCCESS, FAILURE e DENIED;
- persistência somente de tipo/ID da entidade, com resolução autorizada e fallback técnico;
- nenhum snapshot ou diferença before/after;
- lista, filtros, paginação e detalhe sem edição, exclusão ou exportação;
- auditoria de abertura do módulo e detalhe, sem auditar filtros/páginas e sem recursão;
- estados distintos para ausência de eventos, ausência de resultados e falha recuperável.

Em 2026-09-11, a aplicação de DEC-038 preservou DEC-028 a DEC-037 e registrou D-AUTO-001/002 como provisórios. Em 2026-09-17, Amanda e Maycon aprovaram conjuntamente os dois refinamentos; a aceitação cobre comportamento e uso no spike, não schema físico nem arquitetura de produção.

Também em 2026-09-11, Maycon aprovou DEC-039: Spec Kit tornou-se a fonte operacional de SDD, o harness preservou governança e gates independentes, e `$project-task` tornou-se o entrypoint de novas demandas. A integração está pronta para smoke test posterior, sem feature criada.

Em 2026-09-21, Maycon aprovou integralmente DEC-042: operação local/offline sem mensalidade, SQLCipher Community, DPAPI, backup portátil, credencial de recuperação offline, NSIS e manutenção manual no escopo vigente. A decisão aceitou o ADR-0001, fechou o G4 e autorizou a preparação do G5, sem autorizar implementação. Na mesma data, aprovou o ADR-0002/DEC-043: merges revisados na `main` publicam o canal piloto; o updater assinado mostra ícone e solicita confirmação; backup, download, validação, instalação e reinício seguem automaticamente após a confirmação; runner Windows próprio e repositório público separado de artefatos; canal estável posterior. A execução externa ainda está pendente.

## Próxima ação exata

### Atualizador e runner do notebook — retomada de 2026-10-07

Maycon solicitou instalar o segundo runner e corrigir o HTTP 422; depois pediu divisão em subagentes. Guia dos dois computadores em docs/operations/own-runner-setup.md. Empresa: DESKTOP-GEUP094; notebook: DESKTOP-MAYCONI, registro próprio com labels padrão self-hosted/windows/x64. Git/Node e Visual Studio C++ foram localizados no notebook; não havia C:/actions-runner no início. Runner 2.338.0 e Strawberry Perl 5.42.3.1 verificados por tamanho/SHA256 oficial e extraídos; executáveis retornaram versões corretas. Perl testado no ambiente LC_ALL=C/LANG=C e WEBFIT_PERL_PATH configurada no perfil User. Helpers ignorados preparados; início exige marcador criado após validação completa. Registro privado solicitado a Maycon, sem afirmar conexão/build até confirmação. Evidência: .harness/evidence/update-pilot/2026-10-07-notebook-runner.md.

Runs #9/#10 falharam em Publish staged pilot. Inspeção encontrou repositório de artefatos sem branches e rascunho #406174132 com cinco assets enviados. Main ausente era pré-requisito inválido; corpo detalhado do 422 não disponível. Maycon autorizou somente criar README na main de webfit-desktop-releases; commit 1a9838a confirmado. Correção local agora verifica main antes de bootstrap/build e usa SHA válido antes de criar release. Evidência: .harness/evidence/update-pilot/2026-10-07-publication-target.md. Rascunhos preservados.

Próxima ação vigente desta trilha: Maycon revisa/integra os arquivos locais pelo seu fluxo Git para executar o pipeline com código corrigido. Rerun #10 (37690719456), especificamente autorizado e acionado uma vez, usou 667f1ae: job 113043772365 publicou release 406224874, tag pilot-v0.1.9-pilot.10.2, mas falhou na verificação pública. Leitura pública sem credenciais confirmou URL WebFit%20Desktop no manifesto; asset publicado é WebFit.Desktop. Correção local usa nome ASCII com hífen e valida resposta dos uploads; 30 testes e review independente PASS. Não repetir run antigo nem recuperar/remover publicação automaticamente. Depois validar manifesto/assinatura/download público e ensaiar duas versões fictícias, incluindo login/adiar/confirmar/backup/reinício/persistência. Notebook: pacotes já extraídos/verificados, registro privado falhou HTTP 404; helper orienta copiar somente novo token temporário de Configure do repositório correto, rejeita PAT/comando inteiro e remove espaços externos. Registrar e conferir Listening for Jobs/Idle. Um runner válido da empresa basta para publicar.

Checklist desta trilha: [x] diagnóstico e correção local; [x] 30 testes/review independente; [x] README remoto especificamente autorizado; [x] pacotes notebook verificados/extraídos e Perl testado; [ ] registro/conexão/build real do notebook; [ ] integração humana da melhoria local; [x] rerun #10 especificamente autorizado acionado; [x] publicação piloto; [ ] verificação pública válida; [ ] ensaio completo T082/T083/T105/T113. G5 em execução; G6/G7 pendentes. WEBFIT-5 continua separado abaixo, sem aprovação inferida.

### WEBFIT-5 — Cadastro mínimo, 2026-10-07

Maycon autorizou registrar no Plane e preparar alteração com migração. Planejamento em specs/003-webfit-5-cadastro-paciente/, evidência .harness/evidence/webfit-5/planning.md. Próxima ação vigente: obter aprovação funcional conjunta (Amanda não inferida), validar D-PAT-001 (responsável opcional) e D-PAT-002 (sexo antigo preservado até seleção explícita), e autorizar execução do plano. Depois executar T001..T015 com dados fictícios, mantendo banco/backup e vínculos na migração. Não executar banco ativo de produção, Git mutável ou publicação.

Checklist desta demanda: [x] registro/pesquisa/Specification/Plan/Tasks/Analyze; [x] checks documentais; [ ] validação humana e execução autorizada; [ ] implementação/migração/testes; [ ] Verification/Review e Security/UI; [ ] aceite final. G5 continua em execução, G6/G7 pendentes. Os checkpoints abaixo permanecem histórico de demandas anteriores, não a próxima ação de WEBFIT-5.

### Retomada do desenvolvimento — Auditoria, 2026-10-07

Retomada posterior: Maycon liberou espaço e os checks finais passaram (frontend 12 testes, Rust/SQLite 18 testes, formatação, Clippy, build frontend e diff --check). Foco do detalhe implementado. Bloqueio histórico abaixo resolvido; próxima ação vigente é revisão/ensaio Windows, incluindo teclado, filtros, paginação e falha/retry. HEAD atual 9f5a949aa479061fff7078ba82fc130467f7b2a6. Checklist atualizado: [x] código e checks locais; [x] conferência final e format:check; [ ] ensaio visual/teclado; [ ] revisão independente/aceite integral. G5 segue em execução.

RF-AUD-001 / T051/T056 parcialmente complementados na interface existente: carregamento, erro recuperável, vazios distintos, filtros/retry e detalhes de metadados em português. npm run check PASS (lint, TypeScript, 12 testes Node e build frontend); evidência .harness/evidence/health-increment/2026-10-07-audit-ui.md. G5 permanece em execução; T056/T057, revisão independente e G6/G7 não concluídos.

Branch/commit-base observados antes das alterações: main, c4526f5384f4a479edf52ee589d98854614428c0; main acompanhava origin/main na leitura local, sem fetch/pull. .prettierrc.json preexistente preservado. Sem operações Git mutáveis pelo agente. Estado final Git não conferido: executor bloqueado por falta de espaço (os error 112) e depois native MXC unavailable; documentação concorrente preservada.

Próxima ação desta entrega: recuperar espaço/execução de ferramentas, conferir diff e format:check, concluir checks aplicáveis e ensaiar Auditoria no Windows com dados fictícios, incluindo foco do detalhe, filtros, paginação e falha/retry. Não gerar instalador local; integração pelo usuário e distribuição pelo pipeline. Pendências de updater e WEBFIT-4 abaixo permanecem.

Checklist do Gate nesta entrega: [x] código local e checks frontend; [ ] conferência final e format:check; [ ] ensaio visual/teclado; [ ] revisão independente/aceite integral. Sem aprovação de novo Gate.

WEBFIT-4 está em REVIEW: D-NAV-001/002 e execução aprovadas por Maycon em 2026-10-07; código/checks/revisão técnica concluídos. Maycon revisa e integra pelo seu fluxo Git; acompanhar pipeline e atualização na aplicação. Sem gerar instalador local. Após receber a versão, ensaiar hambúrguer/nome/engrenagem, teclado completo e zoom nativo com dados fictícios e registrar aceite final. Evidência e limites em .harness/evidence/webfit-4/{verification,review,evidence}.md. A simulação frontend não certifica distribuição ou aceite integrado. G5 em execução; G6/G7 pendentes.

Pendência operacional: DEC-053, candidato updater 0.1.8, revisão independente e ensaio do pipeline/publicação assinada/latest.json, login/faixa/adiar/confirmar/backup/reinício/persistência. Runs #2/#3 falharam em `shell: powershell`; run #4 falhou durante download de componente Rust. Evidências `.harness/evidence/update-pilot/2026-10-07-runner-execution-policy.md`, `2026-10-07-runner-powershell-shell.md` e `2026-10-07-rust-download-stream.md` e `2026-10-07-rust-download-retries.md`. Integração/commit/push/merge são do usuário. T082/T083/T105/T113 permanecem pendentes; notebook não bloqueia runner válido da empresa. Registro histórico anterior ao rerun #10: nenhuma release havia sido publicada naquela etapa.

## Gates

| Gate | Objetivo | Estado | Evidência/condição seguinte |
|---|---|---|---|
| G1 | aprovar visão, autoridade e MVP Saúde | **aprovado em 2026-08-20** | entrevista e DEC-013 |
| G2 | aprovar baseline rastreável do primeiro incremento | **aprovado em 2026-09-17 por Amanda e Maycon** | requisitos, testes e rastreabilidade aprovados; execução técnica e evidências permanecem pendentes |
| G3 | criar plano executável | **aprovado em 2026-09-17 por Maycon** | artefatos Spec Kit aprovados; executar spike G4 |
| G4 | validar arquitetura e spike | **aprovado por Maycon em 2026-09-21** | ADR-0001 aceito; política sem custo recorrente e riscos residuais aprovados |
| G5 | construir incremento vertical | **em execução; DEC-045 autoriza implementação e alterações sensíveis previstas** | WEBFIT-4 código/checks/review concluídos; aceite Windows pendente. Instalador local dispensado nesta demanda; Git humano e pipeline/updater. Verificações e aceite gerais continuam pendentes |
| G6 | validar release candidate | não iniciado | requisitos críticos verificados |
| G7 | liberar para dados reais | não iniciado | restauração exercitada e riscos aceitos |

## Checklist do G2 — primeiro incremento

| Ordem | Seção | Estado | Observação |
|---:|---|---|---|
| 1 | Escopo do incremento | **aprovado** | prescrição/cardápio incluído; PDF/exportação excluídos |
| 2 | Autenticação e sessão | **aprovado** | RF-AUT-001 a RF-AUT-003 |
| 3 | Perfil e espaço Saúde | **aprovado** | RF-CLI-001 e RF-CLI-002 |
| 4 | Pacientes e tags | **aprovado** | RF-PAT-001 a RF-PAT-006 |
| 5A | Composição e ciclo da prescrição | **aprovado por Amanda em 2026-08-21** | RF-PRE-001 a RF-PRE-004, RN-PRE e TA-PRE |
| 5B | Necessidade energética e metas | **aprovado por Amanda em 2026-09-10** | RF-PRE-005, RN-PRE-011 a RN-PRE-024 e TA-PRE-008 a TA-PRE-016 |
| 6 | Rascunhos | **aprovado por Maycon em 2026-09-10** | RF-DRF-001, RN-DRF-001 a RN-DRF-005 e TA-DRF-001 a TA-DRF-004 |
| 7 | Auditoria | **baseline aprovada; D-AUTO-001/002 aceitos em 2026-09-17** | RF-AUD-001, UC-AUD-001, RN-AUD-001 a RN-AUD-017, TA-AUD-001 a TA-AUD-015 e D-AUTO-001/002 |
| 8 | Backup e restauração | **baseline e direção técnica aprovadas** | snapshot, SQLCipher, pacote portátil, checksum, restauração, auditoria e política de credencial offline aprovados; implementação pertence ao G5 |
| 9 | Requisitos não funcionais | **baseline documentada** | RNF-* do incremento; medição pendente |
| 10 | Testes e rastreabilidade | **artefatos preparados** | TA-*, matriz e tasks; execução pendente |
| 11 | Aprovação final do G2 | **aprovado em 2026-09-17 por Amanda e Maycon** | aceite funcional conjunto de Amanda e Maycon |

## Escopo aprovado do primeiro incremento

- autenticação, logout e bloqueio;
- nutricionista e administrador;
- perfil profissional e espaço Saúde;
- pacientes, tags, observações, rascunho, arquivamento e restauração;
- prescrição e cardápio individual;
- auditoria;
- backup automático/manual e restauração mínima;
- persistência após fechar e reabrir.

## Fora do primeiro incremento

- Educação;
- agenda, atendimento, anamnese e antropometria;
- financeiro e planner;
- arquivos clínicos, PDF, impressão, relatórios e exportações;
- nuvem, sincronização e recuperação remota.

## Pendências que não devem ser esquecidas

- No discovery de arquivos, definir limites, categorias, duplicidade, miniaturas e retenção.
- Criptografia, diretório de dados, chaves e pacote de backup foram validados e aprovados no G4; detalhes de implementação e testes de produção pertencem ao G5/G6.
- Pen drive ou SSD externo deve ser decidido antes do G7.
- A política de custo zero foi aprovada em 2026-09-21; ver `docs/operations/cost-free-operation.md`.
- Incluir avisos de licença e inventário de componentes antes do release.
- ADR-0002/DEC-043 aceitos: dependências, chave, workflow, repositório e runner foram preparados; endpoint local configurado em 2026-10-06; publicação e validação ponta a ponta ainda estão pendentes.
- Retenção clínica definitiva precisa de avaliação antes de dados reais.
- Educação e serviços em nuvem exigem novo ciclo/ADR.

## Como trocar de máquina

### Antes de sair da máquina atual

1. Atualizar este arquivo.
2. Executar `git status` e revisar o diff.
3. Criar um commit intencional.
4. Executar `git push` na branch registrada.
5. Confirmar que o commit remoto corresponde ao trabalho local.

### Na outra máquina

1. Confirmar que não há alterações locais conflitantes.
2. Executar `git fetch origin`.
3. Trocar para a branch registrada acima.
4. Executar `git pull --ff-only`.
5. Abrir este arquivo e continuar pela seção **Próxima ação exata**.

## Documentos de apoio

### Harness e demanda de navegação — 2026-10-07

- DEC-054 aceita por Maycon: Git sob controle humano; demandas na branch atualmente ativa, sem setup obrigatório ou bloqueio por nome/base/árvore suja. Inspeção somente leitura e preservação de alterações permanecem. Branch/commit-base acima preservados; nenhuma sincronização remota ou operação Git mutável nesta correção.
- Última etapa desta correção: política documental e skills locais alinhadas; WEBFIT-4 retornou de Blocked para Planning. Evidência: `.harness/evidence/2026-10-07-human-git-control.md`.
- WEBFIT-4: discovery, Specification/Plan/Tasks/Analyze e execução aprovados por Maycon; Implement/Converge/checks/review concluídos. Consultório é único módulo, lateral totalmente recolhível, ferramentas em Configurações, conta pelo nome. D-NAV-001/002 ACCEPTED; instalador local dispensado. UI integrada/aceite, updater e G5/G6/G7 permanecem pendentes. Evidência .harness/evidence/webfit-4/evidence.md.

- [Escopo](../product/scope.md)
- [Requisitos funcionais](../requirements/functional-requirements.md)
- [Regras de negócio](../requirements/business-rules.md)
- [Testes de aceite](../requirements/acceptance-criteria.md)
- [Matriz de rastreabilidade](../requirements/traceability.md)
- [Decisões](decision-log.md)
- [Product Backlog](product-backlog.md)
- [Roadmap](roadmap.md)

## Gatilho de retomada

Ao receber **“Vamos continuar onde paramos”** ou variação clara, este arquivo deve ser lido integralmente antes de qualquer planejamento ou alteração. O estado Git deve ser comparado com este checkpoint e a retomada deve começar por **Próxima ação exata**.

## Regra de manutenção

Ao final de cada sessão, atualizar pelo menos: data, branch, commit-base, sincronização, última etapa concluída, próxima ação e checklist do Gate. Não marcar Gate como aprovado sem decisão dos aprovadores e evidência correspondente.

## Inventário local desta sessão

- 2026-10-06: DEC-044 registrada após aprovação explícita de Maycon; plano/tarefas e operação alinhados; workflow local desativado para publicação. Checks documentais/diff; nenhuma dependência instalada, publicação, commit ou push. Alterações preexistentes preservadas.

- Custódia no Bitwarden confirmada por Maycon em 2026-10-06: chave e senha salvas em nota segura e reabertas após novo login. Conteúdo não consultado pelo agente; restauração criptográfica a partir do cofre ainda não testada.

- Retomada em 2026-10-06: branch e HEAD confirmados, contagem HEAD/upstream local 0/0, sem fetch. Inspeção somente leitura dos pré-requisitos: Node no PATH de máquina; Cargo/Rust local no perfil de Maycon, disponibilidade no perfil NetworkService ainda não comprovada. Perl completo não localizado no PATH de máquina nem nos diretórios usuais consultados; tentativa com Perl do Git falhou por restrição de acesso MSYS no ambiente de execução, sem comprovar falha no serviço. Builds anteriores usaram cache e não comprovam compilação limpa SQLCipher pelo runner. Nenhuma instalação/configuração externa/publicação executada; Maycon informou não possuir gerenciador nem mídia externa e escolheu a opção de gerenciador de senhas. Bitwarden com nota segura no plano gratuito recomendado; criação da conta e transferência/recuperação da chave ainda pendentes, sem valores consultados.

- 2026-10-06: correções locais do workflow autorizadas e concluídas: checks existentes antes do build assinado, verificação pública de manifesto/assinaturas e SHA256SUMS. Nenhuma publicação executada. Evidência: [workflow local](../../.harness/evidence/update-pilot/2026-10-06-workflow-verification.md).

- 2026-10-06: endpoint HTTPS do updater adicionado localmente ao spike sob autorização específica; JSON e chave pública conferidos. Revisão estática identificou lacunas do workflow antes da publicação; nenhuma alteração de workflow ou publicação executada nesta etapa. Evidência: [endpoint local e revisão estática](../../.harness/evidence/update-pilot/2026-10-06-updater-endpoint.md).

- 2026-10-06: rotação autorizada da chave do piloto concluída localmente; chave antiga preservada; senha aleatória protegida por DPAPI CurrentUser; assinatura e rejeição de arquivo alterado verificadas; apenas a chave pública do spike foi alterada. Cadastro dos secrets posteriormente autorizado e confirmado por Maycon e pela imagem; valores não consultados. Custódia portátil ainda pendente. Evidência: [rotação local da chave](../../.harness/evidence/update-pilot/2026-10-06-signing-key-rotation.md).

- 2026-10-06: correção autorizada da conta do serviço `actions.runner.Maycon-bd-WebFit-DESKTOP.DESKTOP-GEUP094` para `NT AUTHORITY\NetworkService`, executada por Maycon em PowerShell elevado e confirmada por `sc.exe qc`. O log de instalação de 2026-09-21 confirma configuração e permissões concedidas antes do erro 1068 ao iniciar. A documentação da Microsoft exige o nome não localizado para configurar essa conta: <https://learn.microsoft.com/en-us/windows/win32/services/networkservice-account>. Inicialização posteriormente autorizada e executada por Maycon: `sc.exe query` confirmou `RUNNING` e códigos zero; leitura direta do log `C:\actions-runner\_diag\Runner_20261006-133527-utc.log` confirmou `Listening for Jobs` às 10:35:31 e 10:35:37 (America/Sao_Paulo). Erro 1068 resolvido no teste; início automático após reiniciar o Windows validado por Maycon com RUNNING e códigos zero; o novo log C:\actions-runner\_diag\Runner_20261006-134402-utc.log confirmou Listening for Jobs às 10:44:07 (America/Sao_Paulo). Nenhuma instalação ou novo registro do runner; nenhum workflow foi disparado pelo agente, e o estado de publicação no GitHub não foi consultado nesta etapa.

- Skills de 2026-09-30: criação de `webfit-checkpoint` e `webfit-verificar`; renomeação operacional para `webfit-task`. DEC-039 e evidências históricas conservam o nome original `project-task`; a renomeação não muda a decisão de usar Spec Kit nem suas autoridades. Etapa LIGHT documental; sem alteração de produto, workflow ou skill oficial.

- 2026-09-30: instruções do harness e `project-task` simplificadas por solicitação humana; correções documentais preservam gates, Plane/Branch Safety, Spec Kit oficial e estágio PLANNING. Relatório better-harness preservado como baseline; achados do pipeline ainda pendentes. Não houve alteração no workflow, spike, dependências do projeto ou configuração externa nesta etapa. Evidência: [harness proporcional](../../.harness/evidence/harness-proporcional-2026-09-30.md).

- Alterações preexistentes preservadas nos registros do G4, no spike e nas evidências.
- Documento novo: `docs/operations/cost-free-operation.md`.
- Documento novo: `docs/operations/cost-free-operation-approval.md`.
- Documento novo: docs/operations/update-release-strategy.md.
- Documento novo: docs/operations/update-pipeline-design.md, com workflow local em `.github/workflows/pilot-release.yml`.
- Preparação local T081 executada: `@tauri-apps/plugin-updater`, `tauri-plugin-updater`, chave fora do repositório, configuração de assinatura, UI de verificação e build assinado; repositório `webfit-desktop-releases` criado; runner `DESKTOP-GEUP094` registrado em `C:\actions-runner`; serviço corrigido, iniciado e conectado em 2026-10-06; T082/T083 permanecem pendentes de configuração/validação completa.
- ADR aceito: docs/architecture/adr/ADR-0002-atualizacoes-e-distribuicao.md.
- O commit-base `0de267b` está presente localmente e na origem; as alterações desta análise ainda não foram commitadas nem enviadas; não houve merge, PR, release, publicação, deploy ou implementação do produto.

## Artefato local de teste — 2026-10-06

- Instalador: `.artifacts/mvp/2026-10-07/catalog-0.1.4/WebFit-Desktop-0.1.4-teste-x64.exe`; candidatos anteriores preservados.
- Roteiro, SHA256 e manifesto de fontes acompanham o arquivo na mesma pasta (ignorada no Git).
- Evidência: `.harness/evidence/health-increment/2026-10-06-candidate.md`.
- G5 continua em execução; G6/G7 não iniciados. Catálogo TBCA de 88 itens; T038 base completa/TACO, cobertura integral e revisão independente pendentes.

Refinamento mais recente: DEC-046/RF-UX-001, solicitado por Maycon em 2026-10-06, permite tours simples no MVP. Detalhamento reversível por usuário/tela é AGENT-PROVISIONAL; não altera gates clínicos, arquitetura ou distribuição manual. Checklist G5: T084–T086 verificados; T087 ensaio visual Windows 10 pendente.

Refinamento 2026-10-07: DEC-047 altera somente o mínimo de acesso da RN-AUT-001 para seis, recuperação permanece doze; T088/T089 verificados e T090 manual pendente. Evidência `.harness/evidence/health-increment/2026-10-07-password-length.md`. Branch/HEAD preservados; sem fetch, commit/push ou publicação.

Distribuição mais recente: DEC-048/RF-DIS-001; T091/T092 verificados, T093 manual pendente. Executar nova versão sem desinstalação manual e selecionar explicitamente Atualizar mantendo os dados; escolha padrão do NSIS preservada. Evidência `.harness/evidence/health-increment/2026-10-07-installer-update.md`.

Política vigente até a automação: toda nova versão é entregue por instalador; executar com o mesmo usuário Windows e selecionar Atualizar mantendo os dados, sem desinstalação manual. Vigência até pipeline com runner e updater implementados, validados e ativados. Fonte operacional: `docs/operations/installation.md`; pedido explícito de Maycon em 2026-10-07.

Continuação mais recente: RF-PRE-002/T038; checklist G5: T094/T095 verificados, T096 instalador local gerado em .artifacts/mvp/2026-10-07/catalog-0.1.4/, T097 ensaio Windows 10 pendente. Nenhum Gate foi concluído com o retorno geral de uso. Evidência: .harness/evidence/health-increment/2026-10-07-food-catalog.md.

Conferência final desta entrega: alterações paralelas RF-UX-002/DEC-049 apareceram em documentos/Spec Kit e tela de login; preservadas. O pacote de catálogo 0.1.4 foi gerado antes delas, com manifesto das fontes compiladas, e não contém o refinamento de login. Verificação desse trabalho pertence à sua entrega correspondente; não sobrescrever nem atribuir os checks do catálogo à árvore alterada em paralelo.

Pesquisa de distribuição, 2026-10-07: Maycon solicitou análise detalhada de franquias gratuitas e alternativas para publicar atualizações após integrar na main. Relatório em docs/operations/update-hosting-analysis-2026-10-07.md, com fontes oficiais GitHub, Azure, CircleCI, GitLab, AppVeyor e Tauri. Recomendação para decisão: Windows padrão hospedado pelo GitHub, Releases separado e runner próprio como contingência; orçamento bloqueante e consumo real da conta precisam ser conferidos. A escolha vigente de runner próprio não foi substituída por aprovação presumida. Sem ativação, cobrança, credenciais ou publicação. HEAD fa70d8f e upstream local 0/0 sem fetch; trabalho de produto/login preservado. Próximo passo desta pesquisa: validar escolha de provedor e preparar adaptação do pipeline da raiz e updater conforme ADR-0002, antes de ativação externa. Checklist de gates permanece: G5 em execução, G6/G7 pendentes; pesquisa não conclui T082/T083.

## Checkpoint complementar — RF-UX-002 / DEC-049, 2026-10-07

- Data: 2026-10-07. Branch feature/pbi-001-primeiro-incremento-saude; commit-base/HEAD fa70d8fa4eac712801c2f3297d29e78a0f130bdb; upstream local 0/0, sem fetch ou consulta remota.
- Última etapa concluída: T098/T099, informações no canto inferior direito do login, versão Tauri, crédito e acesso administrativo; preparação retirada do acesso inicial normal e nome admin predefinido para instalação nova. Senhas escolhidas localmente; contas existentes preservadas. Evidência .harness/evidence/health-increment/2026-10-07-login-info.md.
- Sincronização: alterações de catálogo/versão/docs/testes já presentes ou produzidas paralelamente preservadas; este refinamento altera interface e documentação, sem backend/schema/dependências. Nenhum commit/push/PR/publicação.
- Próxima ação exata deste refinamento: gerar novo candidato que inclua RF-UX-002 e ensaiar T100/TA-UX-002 no Windows 10 x64, com dados fictícios. O instalador catalog-0.1.4 gerado antes não contém RF-UX-002; não tratá-lo como atualizado por este código.
- Checklist G5: T098/T099 concluídos; T100, revisão independente, aceite visual, cobertura restante e G6/G7 pendentes. Atualização manual DEC-044 preservada.
- Verificação: lint/TypeScript/build, seis Node, formatação TS/CSS/Rust, clippy e 15 Rust passaram. Rust com TMP/TEMP apontando para .artifacts/test-temp-login-info; no TEMP padrão houve erro STORAGE no teste de backup. Não confundir esse resultado com ensaio no instalador ou investigação definitiva do ambiente.

Refinamento DEC-051 / TA-UPD-UI-001 em 2026-10-07: T106/T107 concluídos como código/checks/pacote; aceite gráfico e revisão independente pendentes. Branch/HEAD fa70d8f e upstream local 0/0 preservados sem fetch. Trabalho paralelo preservado, sem commit/push/publicação. Instalador 0.1.6 precisa de atualização manual enquanto pipeline não ativo.

## Checkpoint complementar — critique/audit frontend, 2026-10-07

- Solicitação: revisão com impeccable; análise LIGHT documental, sem implementação. Alvo src/App.tsx e demais componentes/CSS da árvore local 0.1.6; avaliações independentes de UX e técnica concluídas.
- Branch/commit-base/HEAD: feature/pbi-001-primeiro-incremento-saude, fa70d8fa4eac712801c2f3297d29e78a0f130bdb. Sincronização: trabalho preexistente preservado, sem fetch/commit/push ou operação remota; upstream local registrado anteriormente 0/0 não implica nova consulta remota.
- Última etapa concluída: critique 24/40 e audit 12/20 provisórios; nove achados (quatro P1, cinco P2). Lint, TypeScript e build passaram; JS único 525,74 kB com aviso Vite. Detector src retornou zero achados. Snapshot arquivado em .impeccable/critique/ para alvo src-app-tsx.
- Limite: duas tentativas independentes CUA localhost:1420 falharam com timeout. Sem inspeção visual, teclado/zoom ou aceite Windows. Servidor Vite iniciado para a revisão foi encerrado.
- Próxima ação desta revisão: priorizar correções de edição durante salvamento, estado da meta energética, recuperação de erros e contraste, pelo fluxo vigente; depois ensaiar interface/teclado em 1366×768 a 200%. A Próxima ação exata de updater/piloto permanece vigente.
- Checklist de Gate: G5 segue em execução; ensaio visual, cobertura integral, review/aceite permanecem pendentes; G6/G7 não iniciados. A auditoria não conclui T087/T100/T107 nem aprova design system ou muda RF-UX-002/DEC-049. Nenhum código, banco, dependência ou decisão clínica alterado.

## Checkpoint — nome lembrado, 2026-10-07

Branch feature/pbi-001-primeiro-incremento-saude; HEAD/commit-base fa70d8fa4eac712801c2f3297d29e78a0f130bdb; upstream local 0/0, sem fetch/consulta remota. Alterações anteriores/paralelas preservadas; esta sessão adicionou RF-AUT-004/DEC-052, frontend/backend/teste, documentação e candidato 0.1.7. Sem commit/push/PR/merge/publicação/instalação no host. Evidência .harness/evidence/health-increment/2026-10-07-remember-login.md.

Última etapa: T108/T109 concluídos; próxima ação exata: instalar/atualizar com mesmo usuário Windows via .artifacts/mvp/2026-10-07/remember-0.1.7/WebFit-Desktop-0.1.7-teste-x64.exe e ensaiar T110/TA-AUT-005 com dados fictícios. Este candidato inclui refinamentos anteriores da árvore. Checklist G5: código/checks/pacote do nome lembrado concluídos; T110, ensaios anteriores, revisão independente, cobertura restante e G6/G7 pendentes. Distribuição manual vigente até validação/ativação do updater; nenhum gate final inferido.

DEC-053, 2026-10-07: T112 código/checks/pacote concluídos; T113 preparação local concluída, review e execução pelo serviço pendentes. Git pelo usuário; oito Node frontend, seis Node release e 18 Rust passaram. Consulta em cada login e faixa superior; ensaio gráfico/ponta a ponta e gates finais pendentes. Fontes/evidência .harness/evidence/update-pilot/2026-10-07-banner-activation.md; guia docs/operations/own-runner-setup.md.

## Checkpoint — portabilidade das skills, 2026-10-07

- Branch observada: `main`; commit-base/HEAD: `667f1ae5b4e0b36f65be8ecd19118075f0c63f77`, posterior ao `a83998e` registrado no início deste arquivo. Divergência comunicada antes das edições.
- Sincronização: comparação com upstream local `origin/main` em 0/0, sem fetch/pull ou consulta ao remoto vivo. Árvore limpa no início; esta sessão alterou somente este checkpoint e `.harness/integrations/codex-skill.md`, sem commit/push.
- Última etapa concluída: conferência LIGHT das três skills próprias do WebFit e dez oficiais do Spec Kit, todas já versionadas em `.agents/skills/`; orientação de uso nas duas máquinas registrada na [integração Codex Skills](../../.harness/integrations/codex-skill.md#uso-nas-duas-máquinas). Nenhuma skill precisou ser copiada ou modificada.
- Próxima ação desta manutenção: Maycon sincronizar a documentação pelo seu fluxo Git e conferir o catálogo no checkout da outra máquina. A próxima ação de produto permanece revisar WEBFIT-5 e obter as aprovações funcionais e de execução registradas acima.
- Checklist do Gate: manutenção documental concluída; execução na segunda máquina não verificada. G5 segue em execução, G6/G7 não concluídos; nenhuma aprovação de produto ou publicação alterada.

## Checkpoint complementar — WEBFIT-7, 2026-10-08

- Branch `main`; commit-base/HEAD `e07cdc8300de0421dbdc7fd64aafe7d30a191e80`; comparação local com `origin/main` indica 0/0, sem fetch ou consulta ao remoto vivo.
- Escopo: rascunho contextual para todos os formulários longos aprovados (perfil, cadastro/edição de paciente e prescrição/cardápio). Maycon aprovou a implementação em 2026-10-08. Specification, Plan, Tasks e Analyze registrados em `specs/007-recuperar-rascunho-contextual/`; requisitos e fluxo atualizados; T001..T012 concluídas. Converge não identificou trabalho de implementação restante.
- Última etapa concluída: modal contextual com restauração/descarte, consulta atualizada do serviço autenticado ao entrar no contexto, sem faixa global; descarte mantém cadastro novo vazio, dados persistidos da edição e registros clínicos de prescrição. Diálogo nativo acessível com foco restaurado ao formulário. Sem mudança em banco, Rust, autorização, dependências ou arquitetura.
- Verificação local: lint, TypeScript, build, Prettier, detector Impeccable e `git diff --check` passaram. Build tem aviso de chunk JS 535.96 kB. Testes automatizados, ensaio manual Windows/WebView e Review independente não executados; nenhum dado real usado. Evidência `.harness/evidence/webfit-7/verification.md` e `.harness/evidence/webfit-7/evidence.md` (READY WITH WARNINGS).
- Sincronização: árvore já continha alterações de WEBFIT-6/8/9, identidade visual, atualização e documentação; preservadas sem atribuí-las a esta feature. Nenhum commit/push/merge/PR/publicação, nem operação Git mutável.
- Próxima ação exata: ensaiar TA-DRF-005..010 com dados fictícios no aplicativo Windows nos quatro contextos, incluindo descarte, falha e teclado/tecnologia assistiva; depois Review independente e aceite funcional humano.
- Checklist de Gate: implementação autorizada e concluída; verificação estática concluída; ensaio comportamental, Review, aceite final e gates G5/G6/G7 permanecem pendentes. Não inferir conclusão de gate.
