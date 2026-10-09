# P06 — Atualização ponta a ponta e segundo runner

- Data: 2026-10-09.
- Status: **PENDENTE — evidência operacional parcial**.
- ID local de pendência; não é ID Plane, requisito aprovado ou tarefa formal de infraestrutura.
- Tipo: spec documental de retomada solicitada por Maycon; execução futura segue o registro canônico existente e webfit-task.

## Origem e estado atual

Há publicações e medição bem-sucedida de cache no runner da empresa em registros posteriores. Pendências históricas de publicação não significam ausência de qualquer publicação; ciclo integral e notebook não estão comprovados.

Fonte operacional: [checkpoint](../../docs/project/status.md). Esta spec detalha a pendência e não substitui o checkpoint ou os artefatos de execução.

## Resultado e escopo pendente

Concluir lacunas T082/T083/T105/T113, ensaio com duas versões fictícias e conexão/build do notebook se ainda necessário.

## Restrições e decisões

Git, secrets, registro de serviço e publicação só no escopo especificamente autorizado. Nunca pedir secrets em texto claro. Um runner válido da empresa basta para publicar.

Somente dados fictícios. Sem instalação, migração, Git mutável, publicação ou mudança de produto nesta entrega documental. A profundidade STANDARD/STRICT da retomada é definida pelo risco; vínculo Plane obrigatório antes de artefatos formais novos quando aplicável.

## Critérios de conclusão da pendência

- [ ] Manifesto/assinatura/download público válidos.
- [ ] detectar/adiar/confirmar, backup antes de instalar, reinício e dados preservados.
- [ ] faixa durante sessão e edição.
- [ ] resultado do runner identificado por commit/run.
- [ ] notebook com conexão/build comprovados ou pendência declarada.
- [ ] Evidência identifica versão/commit, ambiente, cenário, resultado PASS/FAIL/NOT RUN e limites.
- [ ] Revisão e aceite pertinentes registrados sem inferir G5/G6/G7.

Estes critérios organizam verificação/propostas; não alteram critérios de produto aprovados nas fontes abaixo. Critérios propostos de N01–N05 precisam validação no Discovery/Plan pertinente.

## Próxima ação

Reconciliar evidências por run/commit e executar apenas passos ainda faltantes sob autorização adequada.

## Detalhamento para retomada

### Objetivo, atores e entradas

Comprovar atualização assinada entre duas versões no aplicativo e operação do runner necessário, sem confundir publicação bem-sucedida com atualização instalada. Notebook é uma trilha adicional, não pré-condição quando o runner da empresa basta.

Duas versões fictícias ordenadas, endpoint/manifesto público, assinaturas/hashes, run e commit de origem, runner utilizado e fixtures persistidas. Secrets devem estar provisionados pelo fluxo autorizado sem conteúdo no documento.

### Fluxo de trabalho previsto

1. Reconciliar runs posteriores bem-sucedidos com registros históricos de falha; identificar exatamente quais critérios continuam faltantes.
2. Conferir pré-requisitos/conta/permissões do runner a usar sem mudar configuração por iniciativa própria.
3. Se autorizado, publicar candidato pelo pipeline existente e verificar assets/manifesto/assinatura/download público.
4. No destino fictício, detectar versão superior, adiar e voltar; conferir faixa durante uso/edição e bloqueios.
5. Confirmar atualização, observar backup/progresso/instalação/reinício e conferir dados/acessos preservados.
6. Registrar ensaio notebook separadamente; testar cache frio/aquecido só quando nova evidência for necessária, sem prometer tempo.

Passos de execução acima são planejamento de retomada, ainda não executados nesta entrega. Operações dependentes seguem as autorizações e o status do início desta spec.

### Cenários verificáveis

IDs abaixo são locais de cenário; não substituem IDs TA/RF aprovados. Resultados que detalham uma proposta N permanecem propostos até validação pertinente.

| Cenário | Dado | Quando | Resultado a verificar |
| --- | --- | --- | --- |
| P06-C01 | Versão superior válida | Consultar no login/intervalo/retorno | Faixa correta e consulta conforme RF-UPD-001/WEBFIT-9 |
| P06-C02 | Edição não concluída | Adiar/ver detalhes | Dados preservados; instalação depende da confirmação |
| P06-C03 | Confirmação autorizada | Instalar e reiniciar | Backup consistente anterior, assinatura validada, dados/acesso mantidos |
| P06-C04 | Manifesto/assinatura/download inválido | Tentar atualizar | Rejeição/erro seguro e recuperação; versão instalada preservada |
| P06-C05 | Operação concorrente ou backup falha | Confirmar instalação | Bloqueio conforme contrato, sem instalação insegura |
| P06-C06 | Serviço notebook preparado | Registrar/conectar/build sob autorização | Conta/runner/run comprovados; falha não afeta prova do runner da empresa |

### Fronteiras técnicas e verificação

Alvos: .github/workflows/pilot-release.yml, scripts de preflight/preparação/staging/publicação, src-tauri/src/update.rs, src/update-check.ts e src/UpdatePanel.tsx. Reutilizar testes existentes de release e negativas de assinatura; não reescrever pipeline por mudança de spec.

Na retomada, primeiro mapear cenário para critério aprovado e teste existente. Executar checks proporcionais ao diff final conforme [Definition of Done](../../docs/quality/definition-of-done.md). Para documentação desta sessão, testes frontend/Rust/build/Windows são NOT RUN por ausência de mudança de comportamento.

### Dependências, riscos e decisões abertas

Publicação/serviço/secrets/Git exigem autorização delimitada. Dados da conta ou PAT jamais aparecem nos logs. Um run aquecido mais rápido é observação, não garantia. Queda de rede deve preservar versão/dados e manter caminho de recuperação autorizado.

### Entrega e evidência esperadas

Relatório com dois candidatos, hashes, runs e cenários, backup prévio e reabertura com dados fictícios; resultado de notebook separado e aceite D-CI-011/D-UPD9-001 explícito. T082/T083 só concluídos pelos critérios reais vigentes.

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
- [006-webfit-9-faixa-atualizacao/spec.md](../006-webfit-9-faixa-atualizacao/spec.md).
- [WEBFIT-11/task.md](../WEBFIT-11/task.md).
- [operations/own-runner-setup.md](../../docs/operations/own-runner-setup.md).

