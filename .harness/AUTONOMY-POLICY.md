# Política de autonomia decisória

## Modelo

O harness adota **AUTONOMOUS DECISION WITH HUMAN VALIDATION**. O agente deve usar contexto, evidência, requisitos, restrições e comparação explícita de alternativas para selecionar a melhor opção justificável. A seleção autônoma nasce como `AGENT-PROVISIONAL`, permanece visível e aguarda validação humana.

Autonomia não autoriza inventar requisito, contrariar decisão `ACCEPTED`, ampliar escopo ou executar ação irreversível baseada apenas em decisão provisória.

## Estados

- `ACCEPTED`: validada pelo responsável.
- `AGENT-PROVISIONAL`: selecionada pelo agente com evidência suficiente; validação humana pendente.
- `NEEDS-HUMAN-DECISION`: evidência insuficiente, alternativas equilibradas ou decisão ASK-FIRST.
- `REJECTED`: alternativa ou decisão explicitamente rejeitada, com histórico preservado.
- `SUPERSEDED`: substituída por decisão posterior vinculada.

`RESEARCH REQUIRED` pode descrever uma atividade necessária, mas não é estado de decisão. Até a pesquisa produzir base suficiente, a decisão permanece `NEEDS-HUMAN-DECISION`.

## Processo decisório

Para alternativas relevantes:

1. definir problema e restrições;
2. recuperar requisitos e decisões relacionadas;
3. comparar alternativas por simplicidade, segurança, manutenção, testabilidade, custo, performance, UX, compatibilidade, reversibilidade e complexidade futura;
4. avaliar evidência, confiança, impacto e risco;
5. escolher provisoriamente quando a matriz permitir, ou registrar `NEEDS-HUMAN-DECISION`.

Popularidade, novidade, preferência do agente, elegância abstrata ou frequência em exemplos não constituem evidência suficiente.

## Condições para decisão autônoma

Uma opção pode ser `AGENT-PROVISIONAL` quando atende aos requisitos conhecidos, não contradiz decisão `ACCEPTED`, tem justificativa concreta, não depende de informação essencial ausente, não cria risco desproporcional e apresenta vantagem clara.

Decisões triviais, técnicas, locais e reversíveis não devem interromper o fluxo. Devem ser decididas, registradas de forma proporcional e usadas para continuar. Exemplos: nomes internos, organização local, convenção dominante, estado vazio e detalhes pequenos de implementação.

## Matriz confiança × impacto

| Confiança | Impacto baixo | Impacto médio | Impacto alto |
|---|---|---|---|
| Alta | AUTO; registrar proporcionalmente | `AGENT-PROVISIONAL` | `AGENT-PROVISIONAL` somente se reversível e sem condição ASK-FIRST; caso contrário, ASK-FIRST |
| Média | AUTO ou `AGENT-PROVISIONAL` se facilmente reversível e barato corrigir | `AGENT-PROVISIONAL` | ASK-FIRST |
| Baixa | `NEEDS-HUMAN-DECISION` ou pesquisa | `NEEDS-HUMAN-DECISION` ou pesquisa | `NEEDS-HUMAN-DECISION` ou pesquisa |

AUTO descreve a forma de condução, não um estado adicional: quando a escolha precisar integrar o ledger, seu estado é `AGENT-PROVISIONAL`. Escolhas locais efêmeras podem permanecer apenas no plano, diff ou Evidence Report.

## ASK-FIRST

Exigir decisão humana antes de agir em requisito legal, privacidade, retenção, decisão clínica, protocolo nutricional, regra financeira ou fiscal, acesso a dados sensíveis, papéis/permissões de negócio, credenciais, produção, destruição de dados, migração destrutiva, mudança irreversível, custo financeiro externo relevante, lock-in arquitetural significativo ou decisão de produto sem evidência suficiente.

Também usar ASK-FIRST quando alternativas tiverem força semelhante ou faltar informação capaz de mudar materialmente a escolha. O estado é `NEEDS-HUMAN-DECISION`.

## Autonomy budget e validação

Acumular decisões provisórias relacionadas durante a fase em vez de interromper após cada uma. Ao concluir uma fase relevante, apresentar `DECISIONS MADE BY AGENT`, quantidade e, para cada decisão, escolha, alternativas, justificativa, confiança, impacto, risco e status. Solicitar uma única validação: aceitar todas, revisar individualmente ou rejeitar/alterar decisão.

Na aprovação, mudar `AGENT-PROVISIONAL` para `ACCEPTED` e registrar `Validated by: Human` e data. Na rejeição, usar `REJECTED` e registrar o motivo quando fornecido. Alterações posteriores criam ou vinculam nova decisão e preservam o histórico; decisões substituídas usam `SUPERSEDED`.

## Gates

Decisões `AGENT-PROVISIONAL` não bloqueiam automaticamente SPEC, PLAN ou ARCHITECTURE REVIEW quando não são sensíveis, têm confiança suficiente, são reversíveis e não conflitam com decisões aceitas.

Use `READY FOR HUMAN DECISION REVIEW` quando a fase técnica estiver completa e restarem decisões provisórias aguardando validação. Após validação, use `READY` ou o estado equivalente do gate. Um `NEEDS-HUMAN-DECISION` bloqueia somente quando sua resolução é materialmente necessária para o próximo passo.

## Integração com Spec Kit

A matriz aplica-se antes de `$speckit-clarify`. Ambiguidade com alternativa claramente superior, confiança suficiente, reversibilidade e ausência de ASK-FIRST deve ser registrada como `AGENT-PROVISIONAL` e pode sustentar Specification e Plan. Clarify ou decisão humana é reservado para informação material ausente, alternativas equilibradas ou tema sensível. A skill `$project-task` acumula decisões provisórias e as apresenta em lote no Human Decision Review.

## Implementação e loops

Durante implementação, decisões pequenas e reversíveis podem seguir autonomamente dentro do plano aprovado. Alterações em requisito, arquitetura, contrato público, banco/schema, segurança, autorização, domínio ou integração retornam à matriz.

O loop pode avançar com `AGENT-PROVISIONAL` não sensível, reversível, suficientemente confiável e sem conflito. Deve parar diante de `NEEDS-HUMAN-DECISION` que bloqueie materialmente o próximo passo e diante das condições ASK-FIRST. Esta política não ativa loops enquanto o projeto estiver em planejamento.

## Transparência e evidência

O Evidence Report deve incluir `Agent Decisions` com totais de aceitas, pendentes de validação e rejeitadas. Para cada pendência relevante, registrar decisão, impacto, confiança e risco. Nenhuma decisão provisória pode ser apresentada como aprovação humana ou omitida do responsável.
