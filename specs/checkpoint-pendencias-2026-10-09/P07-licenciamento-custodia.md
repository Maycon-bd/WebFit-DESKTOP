# P07 — Licenciamento, custódia e ensaios do emissor

- Data: 2026-10-09.
- Status: **PENDENTE — código/builds existentes; aceite/custódia incompletos**.
- ID local de pendência; não é ID Plane, requisito aprovado ou tarefa formal de infraestrutura.
- Tipo: spec documental de retomada solicitada por Maycon; execução futura segue o registro canônico existente e webfit-task.

## Origem e estado atual

Ativação simplificada implementada; acesso bem-sucedido relatado por Maycon. Backup protegido do emissor e ensaio dos cinco fluxos não foram integralmente confirmados.

Fonte operacional: [checkpoint](../../docs/project/status.md). Esta spec detalha a pendência e não substitui o checkpoint ou os artefatos de execução.

## Resultado e escopo pendente

Concluir ensaios de licença/código, preparação, login administrativo/profissional, suporte/recuperação/reset e custódia pelo responsável.

## Restrições e decisões

Não enviar emissor/cofre/senha administrativa à nutricionista; não acessar secrets nem limpar legado para ativar. Confirmação humana de custódia é distinta de restauração testada.

Somente dados fictícios. Sem instalação, migração, Git mutável, publicação ou mudança de produto nesta entrega documental. A profundidade STANDARD/STRICT da retomada é definida pelo risco; vínculo Plane obrigatório antes de artefatos formais novos quando aplicável.

## Critérios de conclusão da pendência

- [ ] Backup protegido do emissor confirmado e recuperação ensaiada em ambiente adequado.
- [ ] ativação em destino vazio e atualização preservando dados fictícios.
- [ ] cinco tipos cobertos conforme registro canônico.
- [ ] teclado/zoom/review/aceite registrados.
- [ ] Evidência identifica versão/commit, ambiente, cenário, resultado PASS/FAIL/NOT RUN e limites.
- [ ] Revisão e aceite pertinentes registrados sem inferir G5/G6/G7.

Estes critérios organizam verificação/propostas; não alteram critérios de produto aprovados nas fontes abaixo. Critérios propostos de N01–N05 precisam validação no Discovery/Plan pertinente.

## Próxima ação

Recuperar pendências atuais no registro WEBFIT-10 e preparar ensaio licenciado isolado.

## Detalhamento para retomada

### Objetivo, atores e entradas

Validar os cinco fluxos de autorização e recuperar a ferramenta administrativa com segurança. O emissor e seu cofre permanecem separados do aplicativo clínico.

Emissor/candidato identificados, destino fictício vazio ou preparado conforme fluxo, confiança pública correta, licença/código de teste e backup protegido do emissor. Senha/código/chave privada não entram no repositório, evidência ou chat.

### Fluxo de trabalho previsto

1. Conferir registro WEBFIT-10/ADR-0003 vigente, tipos de autorização e versão v1/v2 pertinente.
2. Maycon prepara/custodia acesso administrativo e backup do emissor pelo fluxo humano, sem compartilhar o conteúdo.
3. Ensaiar INITIAL portátil v2 em destino vazio: licença+código→preparação→login profissional/admin; preservar aceitação offline de múltiplos destinos.
4. Ensaiar operações vinculadas de transferência, recuperação administrativa, suporte e reset somente em fixtures apropriadas.
5. Testar replay/adulteração/código errado/tipo/destino incompatível, verificando rejeição e estado intacto.
6. Restaurar backup do emissor em ambiente permitido e comprovar identidade/função preservadas; distinguir confirmação de backup de recuperação efetiva.

Passos de execução acima são planejamento de retomada, ainda não executados nesta entrega. Operações dependentes seguem as autorizações e o status do início desta spec.

### Cenários verificáveis

IDs abaixo são locais de cenário; não substituem IDs TA/RF aprovados. Resultados que detalham uma proposta N permanecem propostos até validação pertinente.

| Cenário | Dado | Quando | Resultado a verificar |
| --- | --- | --- | --- |
| P07-C01 | Destino vazio/licença v2 válida | Ativar e preparar acessos | Sucesso autorizado, associado localmente; nenhum segredo no arquivo de evidência |
| P07-C02 | Código errado/licença adulterada | Importar | Rejeição e rollback sem estado parcial |
| P07-C03 | Destino já preparado/legado | Tentar INITIAL | Recusa pertinente e banco preservado; sem limpeza automática |
| P07-C04 | Transferência/restauração autorizada | Aplicar pacote de fixture | Dados e acessos/licença do destino conforme contrato, sem credenciais da origem indevidamente |
| P07-C05 | Autorização de suporte | Entrar/sair/inatividade/reiniciar | Escopo/consumo/auditoria e limite de até 4h; Touch não estende |
| P07-C06 | Recuperação administrativa/reset | Executar com confirmação/grant | Recuperação sem perda indevida; reset com snapshot e inventário de preservação aprovado |
| P07-C07 | Backup protegido do emissor | Recuperar com senha correta/incorreta | Identidade preservada no sucesso; erro/tamper não sobrescreve cofre válido |

### Fronteiras técnicas e verificação

Alvos: crates/license-protocol, tools/license-issuer, src-tauri/src/license.rs, license_tests.rs, recovery.rs e src/LicensePanel.tsx. Reutilizar testes transacionais/DPAPI/SQLCipher existentes. Assinatura da licença, assinatura do updater e Authenticode são provas diferentes.

Na retomada, primeiro mapear cenário para critério aprovado e teste existente. Executar checks proporcionais ao diff final conforme [Definition of Done](../../docs/quality/definition-of-done.md). Para documentação desta sessão, testes frontend/Rust/build/Windows são NOT RUN por ausência de mudança de comportamento.

### Dependências, riscos e decisões abertas

Fluxos de suporte/reset são sensíveis; ensaio destrutivo somente em banco fictício autorizado. T-LIC-010 pacote de suporte por cópia foi adiado e permanece fora deste escopo. Aceitação offline permite reutilização do pacote em mais de um computador; não prometer uso único global.

### Entrega e evidência esperadas

Evidência por tipo, negativas, inventário preservado e recuperação do emissor sem conteúdo de secrets; custódia confirmada pelo humano e revisão/aceite separados. Não enviar cofre/emissor/senha admin à nutricionista.

Registrar por cenário: requisito de origem, versão/commit/hash quando pertinente, ambiente, pré-condições, passos, resultado esperado/observado, PASS/FAIL/NOT RUN, evidência e limite. Credenciais e conteúdos reais sensíveis não integram a evidência. Falha impede somente a conclusão dos critérios dependentes; critérios restantes podem seguir quando autorizados.

### Sequência de conclusão

- [ ] Reconciliar estado atual, fonte canônica e autorizações sem repetir aprovação suficiente.
- [ ] Validar decisões materiais e vínculo Plane quando obrigatório à retomada.
- [ ] Relacionar cenários aos critérios/testes existentes e executar trabalho pendente autorizado.
- [ ] Corrigir findings cobertos e repetir apenas checks/cenários afetados.
- [ ] Obter revisão independente e aceite pertinentes; registrar pendências residuais.
- [ ] Atualizar o checkpoint único, sem Git mutável automático ou inferência de gate final.

## Artefatos canônicos a reutilizar

- [WEBFIT-10/task.md](../WEBFIT-10/task.md).
- [license-issuer/README.md](../../tools/license-issuer/README.md).

