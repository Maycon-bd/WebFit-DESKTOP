# P04 — Cobertura de backup e restauração

- Data: 2026-10-09.
- Status: **PENDENTE — código/checks parciais existentes**.
- ID local de pendência; não é ID Plane, requisito aprovado ou tarefa formal de infraestrutura.
- Tipo: spec documental de retomada solicitada por Maycon; execução futura segue o registro canônico existente e webfit-task.

## Origem e estado atual

Snapshot, limpeza/publicação e alertas foram corrigidos e testados. Aceite integral TA-BKP e ensaios Windows permanecem pendentes; falhas STORAGE variam com ambiente.

Fonte operacional: [checkpoint](../../docs/project/status.md). Esta spec detalha a pendência e não substitui o checkpoint ou os artefatos de execução.

## Resultado e escopo pendente

Completar RF-BKP-001..003, T058..065 e TA-BKP-001..005, incluindo recuperação após falhas.

## Restrições e decisões

Somente banco fictício isolado, snapshot consistente, checksums/integridade e cópia de segurança. Não copiar banco ativo nem enfraquecer testes por limitação ambiental.

Somente dados fictícios. Sem instalação, migração, Git mutável, publicação ou mudança de produto nesta entrega documental. A profundidade STANDARD/STRICT da retomada é definida pelo risco; vínculo Plane obrigatório antes de artefatos formais novos quando aplicável.

## Critérios de conclusão da pendência

- [ ] Backup manual e diário sem duplicação.
- [ ] restauração válida com integridade/contagens.
- [ ] corrupto/incompatível rejeitado preservando destino.
- [ ] status recente/falha/>24h.
- [ ] falha da cópia de segurança mantém diagnóstico/recuperação.
- [ ] ambiente de teste registrado.
- [ ] Evidência identifica versão/commit, ambiente, cenário, resultado PASS/FAIL/NOT RUN e limites.
- [ ] Revisão e aceite pertinentes registrados sem inferir G5/G6/G7.

Estes critérios organizam verificação/propostas; não alteram critérios de produto aprovados nas fontes abaixo. Critérios propostos de N01–N05 precisam validação no Discovery/Plan pertinente.

## Próxima ação

Mapear cobertura restante e reproduzir cenários isolados com relógio controlado quando aplicável.

## Detalhamento para retomada

### Objetivo, atores e entradas

Comprovar que backup é consistente e que restauração válida recupera dados sem destruir o destino em falhas. Ator: usuário autenticado autorizado; rotinas automáticas são SYSTEM e ações manuais USER.

Bancos fictícios vazios e schemas anteriores pertinentes, dados/arquivos UUID, pacote válido, pacote adulterado/incompatível, manifesto/checksums, relógio controlável e destino com dados anteriores para testar preservação.

### Fluxo de trabalho previsto

1. Mapear TA-BKP-001..005 e regressões de migração/restore/licenciamento já cobertas.
2. Criar snapshot consistente pelo serviço real; validar manifesto, banco e arquivos.
3. Executar trigger diário e estados de sucesso/falha/mais de 24h com relógio controlado.
4. Restaurar pacote válido em destino isolado, conferindo cópia de segurança anterior e integridade final.
5. Injetar falhas em validação, cópia de segurança, staging/publicação e restauração conforme fronteiras disponíveis.
6. Confirmar estado preservado, alerta seguro, retry e auditoria; registrar diferença entre falha de ambiente e falha funcional.

Passos de execução acima são planejamento de retomada, ainda não executados nesta entrega. Operações dependentes seguem as autorizações e o status do início desta spec.

### Cenários verificáveis

IDs abaixo são locais de cenário; não substituem IDs TA/RF aprovados. Resultados que detalham uma proposta N permanecem propostos até validação pertinente.

| Cenário | Dado | Quando | Resultado a verificar |
| --- | --- | --- | --- |
| P04-C01 | Banco/arquivos fictícios | Backup manual | Snapshot válido, checksums e conteúdo consistente |
| P04-C02 | Primeiro uso e repetição no dia | Acionar rotina | Um backup diário conforme regra, sem duplicação indevida |
| P04-C03 | Pacote válido e destino existente | Restaurar | Cópia anterior e integridade/contagens corretas; credenciais/licença do destino conforme contrato |
| P04-C04 | Pacote corrupto/incompatível | Solicitar restore | Rejeição sem substituir destino |
| P04-C05 | Falha na cópia de segurança | Continuar operação | Restauração não prossegue indevidamente; erro/alerta sem falso sucesso |
| P04-C06 | Backup recente/falha/>24h | Abrir status | Estados e recuperação coerentes; auditoria sem conteúdo sensível |
| P04-C07 | Migração 1/2/3 pertinente | Backup/restore | Números e contador preservados conforme WEBFIT-5 |

### Fronteiras técnicas e verificação

Inspecionar src-tauri/src/recovery.rs, database.rs, service.rs, audit_recovery_tests.rs, patient_tests.rs e src/BackupNotice.tsx. Testes de SQLite reais continuam obrigatórios. Isolamento TEMP pode reproduzir evidência anterior, mas não elimina a investigação da falha STORAGE se relevante à execução final.

Na retomada, primeiro mapear cenário para critério aprovado e teste existente. Executar checks proporcionais ao diff final conforme [Definition of Done](../../docs/quality/definition-of-done.md). Para documentação desta sessão, testes frontend/Rust/build/Windows são NOT RUN por ausência de mudança de comportamento.

### Dependências, riscos e decisões abertas

Controle de arquivos/banco é STRICT. Não simular backup por cópia direta de banco ativo. Limpar temporários somente com alvos conhecidos e autorização apropriada; falha não autoriza reset de banco. Restauração testada em versão anterior não prova automaticamente o schema atual.

### Entrega e evidência esperadas

Inventário de pacotes fictícios/hashes, matriz TA-BKP, resultados de integridade e preservação, passos de recuperação e limitação ambiental. O sucesso exige evidência de restore, não apenas criação de arquivo.

Registrar por cenário: requisito de origem, versão/commit/hash quando pertinente, ambiente, pré-condições, passos, resultado esperado/observado, PASS/FAIL/NOT RUN, evidência e limite. Credenciais e conteúdos reais sensíveis não integram a evidência. Falha impede somente a conclusão dos critérios dependentes; critérios restantes podem seguir quando autorizados.

### Sequência de conclusão

- [ ] Reconciliar estado atual, fonte canônica e autorizações sem repetir aprovação suficiente.
- [ ] Validar decisões materiais e vínculo Plane quando obrigatório à retomada.
- [ ] Relacionar cenários aos critérios/testes existentes e executar trabalho pendente autorizado.
- [ ] Corrigir findings cobertos e repetir apenas checks/cenários afetados.
- [ ] Obter revisão independente e aceite pertinentes; registrar pendências residuais.
- [ ] Atualizar o checkpoint único, sem Git mutável automático ou inferência de gate final.

## Artefatos canônicos a reutilizar

- [001-primeiro-incremento-saude/tasks.md](../001-primeiro-incremento-saude/tasks.md).

