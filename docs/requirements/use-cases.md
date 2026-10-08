# Casos de uso

## Licenciamento offline — WEBFIT-10

DEC-058 / ADR-0003 v1 aprovados por Maycon após “Aprovo a implementação”, 2026-10-08. Implementação local em fixtures; verificação e limites no registro único, aceite final pendente.

| ID | Ator / fluxo e resultado | Requisito | Status |
|---|---|---|---|
| UC-LIC-001 | visitante instala/gera solicitação/envia; Maycon emite; visitante importa/prepara; administrador de Maycon autentica offline | RF-LIC-001 | fluxo aprovado |
| UC-LIC-002 | Maycon autoriza destino e usuário restaura backup validado preservando identidade correta | RF-LIC-002 | aprovado para implementação, ADR-0003 v1 |
| UC-LIC-003 | Maycon autentica com autorização temporária; sessão encerra em até 4 h ou ao sair/bloquear | RF-LIC-003 | aprovado para implementação, ADR-0003 v1 |
| UC-LIC-004 | Maycon emite recuperação administrativa, aplica e autentica com nova credencial; dados preservados | RF-LIC-004 | aprovado para implementação, ADR-0003 v1 |
| UC-LIC-005 | Maycon autoriza; backup validado → confirmação separada → limpar consultório mantendo licença/acessos/consumo; cancelamento/falha preserva dados | RF-LIC-005 | aprovado para implementação, ADR-0003 v1 |
| UC-LIC-006 | cópia protegida para diagnóstico isolado e retorno sem perder trabalho posterior | RF-LIC-006 | adiado por Maycon para outra demanda |


**Status:** casos de uso do primeiro incremento aprovados.

| ID | Título | Ator principal | Resultado | Requisitos | Status |
|---|---|---|---|---|---|
| UC-AUT-001 | autenticar e entrar no Saúde | nutricionista/administrador | sessão autorizada e espaço ativo | RF-AUT-002, RF-CLI-002 | aprovado |
| UC-AUT-002 | redefinir senha | administrador | senha temporária e troca obrigatória | RF-AUT-003 | aprovado |
| UC-CLI-001 | manter perfil profissional | nutricionista/administrador | perfil validado e persistido | RF-CLI-001 | aprovado |
| UC-PAT-001 | cadastrar paciente | nutricionista/administrador | paciente ativo criado sem CPF duplicado | RF-PAT-001, RF-PAT-006 | aprovado |
| UC-PAT-002 | localizar e editar paciente | nutricionista/administrador | paciente localizado e alteração confirmada | RF-PAT-002, RF-PAT-003 | aprovado |
| UC-PAT-003 | arquivar e restaurar paciente | nutricionista/administrador | estado alterado sem perda de histórico | RF-PAT-004 | aprovado |
| UC-DRF-001 | recuperar ou descartar rascunho automático | nutricionista/administrador | no mesmo contexto autenticado a pessoa restaura o preenchimento, descarta somente o autosave ou volta sem resolver a recuperação (WEBFIT-13), sem afetar o registro persistido nem prescrição clínica | RF-DRF-001, RF-DRF-002, RF-PAT-006 | aprovado por Maycon em 2026-09-10 e refinado em 2026-10-08 — WEBFIT-7 |
| UC-PRE-001 | montar e finalizar prescrição | nutricionista/administrador | prescrição calculada, versionada e vinculada ao paciente | RF-PRE-001 a RF-PRE-004 | aprovado por Amanda |
| UC-PRE-002 | calcular e ajustar necessidade energética | nutricionista/administrador | protocolo versionado produz estimativa, metas, alertas e histórico de ajustes | RF-PRE-005 | aprovado por Amanda em 2026-09-10 |
| UC-AUD-001 | consultar auditoria | usuário autenticado e autorizado | eventos autorizados consultados com filtros, paginação e detalhe sem exposição de conteúdo sensível | RF-AUD-001 | aprovado por Maycon em 2026-09-10 |
| UC-BKP-001 | criar backup | nutricionista/administrador/sistema | pacote válido criado e estado atualizado | RF-BKP-001, RF-BKP-003 | aprovado |
| UC-BKP-002 | restaurar backup | nutricionista/administrador | pacote validado e dados restaurados | RF-BKP-002 | aprovado |

## UC-AUD-001 — Consultar auditoria

### Objetivo

Permitir que usuário autenticado e autorizado consulte metadados de eventos críticos do espaço permitido para investigação e prestação de contas, sem expor conteúdo sensível ou alterar a trilha.

### Ator

Usuário autenticado e autorizado. Nutricionista e administrador permanecem autorizados conforme a decisão vigente, sem consolidar aqui o modelo definitivo de capacidades por papel.

### Pré-condições

- sessão válida;
- autorização para o espaço consultado;
- operação de consulta autorizada no backend.

### Fluxo principal

1. O usuário abre Auditoria no espaço autorizado.
2. O backend valida sessão, autorização e escopo.
3. Conforme D-AUTO-002, a consulta captura `query_as_of_utc`, estabelece o intervalo semiaberto `[from_utc, to_utc)` e congela snapshot, intervalo e filtros para todas as páginas; por padrão, `from_utc = query_as_of_utc − 30 × 24 h` e `to_utc = query_as_of_utc`.
4. O sistema registra uma única ação AUDIT_MODULE_OPEN, sem registrar o conteúdo visualizado e sem auditar recursivamente a própria persistência desse evento.
5. O sistema consulta os últimos 30 dias, com ordenação fixa do mais recente para o mais antigo.
6. O sistema apresenta a primeira página, limitada a 50 registros, em ordem total por instante UTC decrescente e ID decrescente; páginas seguintes usam cursor opaco do mesmo snapshot.
7. Cada item apresenta somente ator, instante, espaço, ação, tipo/ID da entidade, resultado e motivo quando aplicável. Conforme D-AUTO-001, ator USER usa rótulo autorizado, SYSTEM aparece como “Sistema” e UNAUTHENTICATED como “Não autenticado”, sem exibir identificador tentado.
8. O usuário pode combinar com AND os filtros de período, usuário, ação, tipo de entidade e resultado.
9. Ao abrir um detalhe, o sistema apresenta somente metadados permitidos e registra uma única ação AUDIT_EVENT_DETAIL_VIEW, sem incluir o conteúdo visualizado.
10. Quando autorizado, a interface resolve o rótulo atual da entidade; se não conseguir, mantém tipo e identificador técnico.

### Fluxos alternativos

- Sem eventos no conjunto consultado, mostrar estado vazio real.
- Sem correspondência para os filtros, mostrar estado vazio de pesquisa e manter os filtros.
- O usuário altera o período e a consulta reinicia na primeira página.
- O usuário limpa filtros e retorna ao período padrão de 30 dias.
- Uma entidade não pode ser resolvida e o evento continua visível por tipo e ID.
- Novos eventos criados durante a navegação não alteram o conjunto estável já paginado; aparecem em nova consulta.
- Eventos SYSTEM e UNAUTHENTICATED permanecem consultáveis, mas não correspondem ao filtro de usuário.

### Exceções

- Sessão ausente, expirada ou não autorizada: negar acesso e não retornar eventos.
- Falha de consulta: mostrar erro seguro, não representar como lista vazia e permitir nova tentativa quando recuperável.
- Falha ao resolver rótulo: usar tipo e ID sem perder o evento.
- Falha ao registrar o acesso obrigatório: aplicar RN-AUD-004.

### Filtros

Período, usuário, ação, tipo de entidade e resultado, combinados por AND. Conforme D-AUTO-001, o filtro de usuário considera somente eventos USER. Módulo, origem, ID específico e pesquisa textual livre ficam fora do incremento 1.

### Ordenação

Fixa, do evento mais recente para o mais antigo; conforme D-AUTO-002, empates usam o ID do evento em ordem decrescente.

### Permissões

A consulta exige usuário autenticado e autorizado, com verificação no backend e restrição ao escopo permitido. O modelo definitivo de capacidades dos papéis permanece dependência separada e não é consolidado por este caso de uso.

### Decisões provisórias utilizadas

- D-AUTO-001 — representação controlada do ator.
- D-AUTO-002 — janela UTC, desempate e cursor determinísticos.

Ambas estão `AGENT-PROVISIONAL`, podem orientar especificação e planejamento e não autorizam schema ou implementação antes da validação aplicável.

### Resultado esperado

Lista paginada ou estado vazio correto, contendo somente metadados autorizados, sem edição, exclusão, exportação, snapshots ou diferenças before/after.

### Regras relacionadas

RF-AUD-001; RN-AUD-001 a RN-AUD-017; RNF-PRI-001; RNF-SEG-002; RNF-SEG-003; DEC-016; DEC-025; DEC-026; DEC-028 a DEC-038; D-AUTO-001; D-AUTO-002.

## Fluxos e erros obrigatórios

- Credencial inválida mantém sessão fechada e aplica a espera correspondente.
- CPF inválido ou duplicado impede conclusão e preserva o formulário.
- Cancelar edição não persiste alterações.
- Arquivado não recebe novo registro até restauração.
- Prescrição finalizada não é sobrescrita; correção cria nova versão.
- Entrada clínica obrigatória ausente impede cálculo automático e preserva os dados informados.
- Meta abaixo da TMB e condição especial exigem os alertas e confirmações aprovados.
- Distribuição energética inválida nunca produz gordura negativa ou conclusão silenciosa.
- Falha de autosave preserva a última versão válida e não informa sucesso.
- Expiração do autosave nunca remove uma prescrição explicitamente salva em estado rascunho.
- Falha de backup mantém dados atuais e informa erro acionável.
- Backup inválido nunca substitui o estado atual.
- Toda falha relevante registra apenas metadados seguros na auditoria.
