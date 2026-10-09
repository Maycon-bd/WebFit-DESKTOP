# N02 — Esclarecer estado inicial do cálculo

- Data: 2026-10-09.
- Status: **PROPOSTA PENDENTE — P1 da auditoria, não prioridade humana**.
- ID local de pendência; não é ID Plane, requisito aprovado ou tarefa formal de infraestrutura.
- Tipo: spec documental de retomada solicitada por Maycon; execução futura segue o registro canônico existente e webfit-task.

## Origem e estado atual

Valores padrão plausíveis podem ser confundidos com dados clínicos; cálculo indevido no backend não foi comprovado.

Fonte operacional: [checkpoint](../../docs/project/status.md). Esta spec detalha a pendência e não substitui o checkpoint ou os artefatos de execução.

## Resultado e escopo pendente

Conciliar RF-PRE-005/TA-PRE-008 e política de preenchimento; preservar cálculo salvo. NEEDS-HUMAN-DECISION para regra clínica/estado inicial ainda indefinido.

## Restrições e decisões

Revalidar achado no código/candidato vigente; não autorizar regra clínica ou implementação pela criação deste documento.

Somente dados fictícios. Sem instalação, migração, Git mutável, publicação ou mudança de produto nesta entrega documental. A profundidade STANDARD/STRICT da retomada é definida pelo risco; vínculo Plane obrigatório antes de artefatos formais novos quando aplicável.

## Critérios de conclusão da pendência

- [ ] Entradas e protocolo explícitos conforme critério aprovado.
- [ ] exemplos distinguíveis.
- [ ] cálculo salvo preservado.
- [ ] decisão de domínio documentada antes da mudança pertinente.
- [ ] Evidência identifica versão/commit, ambiente, cenário, resultado PASS/FAIL/NOT RUN e limites.
- [ ] Revisão e aceite pertinentes registrados sem inferir G5/G6/G7.

Estes critérios organizam verificação/propostas; não alteram critérios de produto aprovados nas fontes abaixo. Critérios propostos de N01–N05 precisam validação no Discovery/Plan pertinente.

## Próxima ação

Retomar Discovery do achado, vincular item Plane pertinente e decisões necessárias antes de execução.

## Detalhamento para retomada

### Objetivo, atores e entradas

Impedir que valores exemplificativos pareçam dados do paciente ou estimativa clínica aplicada. Preservar TA-PRE-008: sem protocolo versionado selecionado/entradas obrigatórias, não calcular automaticamente nem apresentar resultado clínico.

Prescrição nova sem energia, prescrição com cálculo salvo, rascunho contextual, protocolos aprovados e entradas obrigatórias de cada um. Não inferir idade, peso, altura ou condição a partir do cadastro sem regra aprovada.

### Fluxo de trabalho previsto

1. Revalidar inicialização atual e presença de valores padrão descritos na auditoria.
2. Comparar estado novo com resultado persistido e rascunho restaurado, distinguindo origem dos campos.
3. Levar à autoridade pertinente a política de estado inicial (campos vazios/seleção explícita ou exemplo claramente separado); recomendação deve ser justificada, sem decisão silenciosa.
4. Especificar bloqueio/validação conforme TA-PRE-008, mensagens e foco.
5. Preservar seleção e entradas válidas de cálculo salvo, sem zerá-las ao entrar.
6. Ensaiar protocolo/inputs incompletos, troca de protocolo, restaurar e reabrir.

Passos de execução acima são planejamento de retomada, ainda não executados nesta entrega. Operações dependentes seguem as autorizações e o status do início desta spec.

### Cenários verificáveis

IDs abaixo são locais de cenário; não substituem IDs TA/RF aprovados. Resultados que detalham uma proposta N permanecem propostos até validação pertinente.

| Cenário | Dado | Quando | Resultado a verificar |
| --- | --- | --- | --- |
| N02-C01 | Prescrição nova sem entradas | Abrir editor | Sem estimativa aplicada ou dados plausíveis apresentados como reais |
| N02-C02 | Protocolo ausente/input obrigatório faltante | Solicitar cálculo | Não calcular; indicar campo/seleção necessários conforme aprovação |
| N02-C03 | Cálculo salvo | Reabrir | Entradas/protocolo e meta salvos preservados |
| N02-C04 | Rascunho válido | Restaurar | Valores recuperados com contexto, sem mistura com exemplos |
| N02-C05 | Troca de protocolo | Revisar entradas | Campos necessários e regras versionadas coerentes; sem inferência clínica |

### Fronteiras técnicas e verificação

Alvos: src/EnergyForm.tsx, src-tauri/src/energy.rs e contratos/persistência existentes. Reutilizar exemplos clínicos TA-PRE-009..016 para demonstrar que a apresentação não muda fórmulas. Não acrescentar protocolo novo.

Na retomada, primeiro mapear cenário para critério aprovado e teste existente. Executar checks proporcionais ao diff final conforme [Definition of Done](../../docs/quality/definition-of-done.md). Para documentação desta sessão, testes frontend/Rust/build/Windows são NOT RUN por ausência de mudança de comportamento.

### Dependências, riscos e decisões abertas

NEEDS-HUMAN-DECISION: política de pré-preenchimento e distinção de exemplos quando não resolvidas pelo requisito. Alterar UX não autoriza mudar referência clínica, coeficiente, gênero/sexo clínico, fatores ou algoritmo. Não escolher opção clínica somente por estética.

### Entrega e evidência esperadas

Decisão de estado inicial com origem/autoridade, cenários novo/salvo/rascunho, validação frontend/backend pertinente e ausência de regressão dos cálculos aprovados. Até lá é proposta pendente, não requisito novo aprovado.

Registrar por cenário: requisito de origem, versão/commit/hash quando pertinente, ambiente, pré-condições, passos, resultado esperado/observado, PASS/FAIL/NOT RUN, evidência e limite. Credenciais e conteúdos reais sensíveis não integram a evidência. Falha impede somente a conclusão dos critérios dependentes; critérios restantes podem seguir quando autorizados.

### Sequência de conclusão

- [ ] Reconciliar estado atual, fonte canônica e autorizações sem repetir aprovação suficiente.
- [ ] Validar decisões materiais e vínculo Plane quando obrigatório à retomada.
- [ ] Relacionar cenários aos critérios/testes existentes e executar trabalho pendente autorizado.
- [ ] Corrigir findings cobertos e repetir apenas checks/cenários afetados.
- [ ] Obter revisão independente e aceite pertinentes; registrar pendências residuais.
- [ ] Atualizar o checkpoint único, sem Git mutável automático ou inferência de gate final.

## Artefatos canônicos a reutilizar

- [critique/2026-10-08T22-48-16Z_src-app-tsx.md](../../.impeccable/critique/2026-10-08T22-48-16Z_src-app-tsx.md).

