# Architecture Review — referência interna do Plan

Avalie a proposta contra requisitos, ADRs, NFRs, segurança, manutenção, escala necessária, custo, testabilidade, reversibilidade, lock-in e complexidade. Evite arquitetura astronauta e complexidade sem requisito concreto.

Recupere decisões relacionadas e compare alternativas. Quando uma opção for claramente superior, não contradizer decisão `ACCEPTED`, tiver confiança suficiente e a matriz permitir, selecione-a como `AGENT-PROVISIONAL`, registre justificativa, evidências, impacto, reversibilidade, risco e consequências, e continue a revisão. Use `NEEDS-HUMAN-DECISION` diante de alternativas equilibradas, informação essencial ausente ou condição ASK-FIRST. Não execute mudança arquitetural irreversível sem validação exigida.

Incorpore o resultado ao Plan Scope Check: PLAN APPROVED BY SCOPE ou PLAN REQUIRES HUMAN DECISION. Decisões provisórias não bloqueantes seguem validação em lote no aceite final; não introduzir fase ou aprovação genérica. Arquitetura material não coberta exige autorização específica.

Aplicar DECISION do [HUMAN INTERACTION CONTRACT](../HUMAN-INTERACTION-CONTRACT.md) antes de pedir escolha ou autorização: explicar decisão, por que surgiu agora, origem no requisito/ADR/decisão anterior ou nova proposta, estado, opções, recomendação, impacto e pergunta clara. Distinguir aprovação para spike de aprovação de produção e dependência necessária de instalação autorizada. Referenciar a cadeia de origem quando não for óbvia.
