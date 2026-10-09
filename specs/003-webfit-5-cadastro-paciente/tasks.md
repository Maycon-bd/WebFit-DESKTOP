# Tarefas — WEBFIT-5

Atualizadas em 2026-10-08; main/3558eddd84211e504ba0457388b1bedc30c9697d. [Plano/evidência](plan.md). Código implementado não equivale a teste executado/aceite. Numeração de tarefas histórica preservada.

- [x] T001 Registrar origem funcional relatada, autorização de implementação/migração e D-PAT-001/003; D-PAT-002 não bloqueante.
- [x] T002 Prova SQLCipher com FKs ON e rollback: SQLite Node e integração SQLCipher PASS, somente fixtures.
- [x] T003 Implementar snapshot cifrado pré-migração com reabertura e teste de falha/recuperação; integração nativa PASS.
- [x] T004 Migration003/runner transacional 0/1/2→3, CPF NULL e número sequencial mantendo UUID, conteúdo/referências; integridade antes do commit.
- [x] T005 Restore schemas1/2/3/staging, contadores e números, preservando licença/credenciais/auditoria/backup preventivo.
- [x] T006 Escrever regressões de comando/autorização, obrigatórios/opcionais, CPF, duplicidade e número; Rust PASS.
- [x] T007 Backend mínimo, sexo F/M, CPF opcional, erros e número controlado pelo servidor.
- [x] T008 Radios acessíveis, opcionais, lista/busca/máscara/legado/número na API e formulário.
- [x] T009 Adequar fixtures de salvamento e onboarding, sem reescrever legado.
- [x] T010 Responsável opcional e sexo legado preservado conforme decisões.
- [x] T011 Executar matriz nativa vazio/v1/v2/futuro/falhas/idempotência/vínculos; integração SQLCipher PASS.
- [x] T012 Executar roundtrips nativos de backups1/2/3, licença/transferência, contador e preservação; integração nativa PASS.
- [ ] T013 Completar checks Rust/SQLCipher/fmt/clippy/build Tauri e ensaios Windows; todos os checks automatizados PASS, ensaio interativo Windows pendente.
- [x] T014 Sincronizar requisitos, regras, aceite, casos, matriz, modelo, operação e pacote vigente sem duplicar specs.
- [ ] T015 Fechar review/evidência com checks nativos e aceite: REVIEW PASSED WITH WARNINGS, revisão independente sem findings abertos, aceite final pendente; sem READY TO SHIP.
- [x] T016 Número sequencial visível sem zeros, UUID preservado, busca e retorno imediato ao salvar; testes/contrato TA-PAT-017.

Somente dados fictícios; preparação do toolchain autorizada e cache local reutilizado. Sem banco real, commit/push ou publicação. Checks nativos concluídos em 2026-10-09; ensaio Windows/aceite permanecem pendentes e não constituem nova aprovação funcional.

- [x] T017 RF-PAT-007 / TA-PAT-018 — substituir obrigatório por asterisco e destacar campos inválidos após tentativa de salvar, com mensagens associadas e correção por campo. Pedido de Maycon em 2026-10-09; evidência do recorte em plan.md.
- [x] T018 RF-PAT-007 / TA-PAT-019 — retorno somente no cabeçalho do cadastro, orientação associada no topo; preservação do fluxo de rascunho. Pedido de Maycon, 2026-10-09, ajuste LIGHT.
- [x] T019 RF-PAT-002 / TA-PAT-020 — substituir os botões segmentados por seletor Ativos/Arquivados com Ativos como padrão, mantendo busca/consulta; acrescentar fixture arquivada e validar interação/teclado.
