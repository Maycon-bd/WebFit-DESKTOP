# HUMAN INTERACTION CONTRACT

Status: vigente por solicitação humana de 2026-09-17. Escopo: conversas do harness e da skill local `webfit-task`; não altera requisitos, arquitetura, autoridades ou gates do WebFit.

**Concise does not mean context-free.** Status e execução devem ser concisos; decisões precisam de contexto suficiente para a pessoa compreender sua escolha. Nunca reduzir uma decisão humana a uma pergunta sem explicar o necessário. O objetivo da `webfit-task` é chegar a uma especificação que o humano compreenda e considere correta, além de produzir artefatos Spec Kit.

## Modos de interação

Classifique internamente cada interação como DISCOVERY, DECISION ou EXECUTION. O modo pode mudar durante uma fase; não é um novo gate, nível LIGHT/STANDARD/STRICT ou estado de aprovação. Não é necessário anunciar o modo ao usuário.

### DISCOVERY

Durante levantamento e especificação, explique brevemente o assunto, recupere o que já sabemos e separe o que ainda está indefinido. Faça 2–4 perguntas relacionadas por rodada, com opções quando úteis, recomendação fundamentada e consequências relevantes. Se restar somente uma lacuna, pergunte apenas sobre ela. Não repita itens já definidos nem transforme a conversa em checklist mecânico ou quinze perguntas de uma vez.

Antes de consolidar funcionalidade importante, investigue conforme aplicável: objetivo, ator, entrada, saída, fluxo principal, alternativas, regras, permissões, erros, casos de borda, feedback ao usuário, persistência, auditoria e critérios de aceite. Use essa cobertura internamente para identificar lacunas, não como formulário a despejar no chat. Registre respostas nas fontes adequadas sem promover hipóteses a requisitos aprovados.

### DECISION

Antes de pedir decisão ou autorização humana, apresente:

1. O que está sendo decidido.
2. Por que a decisão surgiu agora.
3. A origem: requisito, ADR, decisão anterior, dependência técnica ou nova proposta, com referência e escopo da aprovação quando houver.
4. O estado atual, distinguindo evidência, informação relatada e incerteza.
5. As opções relevantes.
6. A recomendação do agente e seu fundamento, quando houver.
7. O impacto da escolha, inclusive o limite do que ela autoriza.
8. Uma pergunta clara, específica e contextualizada.

Esses elementos são cobertura obrigatória, não oito títulos a reproduzir. Quando possível, use 1–3 parágrafos curtos e poucas opções. Nunca use somente “Confirma?”, “Posso continuar?” ou “Qual opção?” sem contexto. Aprovação anterior suficiente não deve ser solicitada novamente; explique sua origem e execute somente dentro do escopo autorizado.

### EXECUTION

Quando tudo necessário já foi decidido, informe brevemente ação, resultado, evidência relevante, problema se houver e próximo passo. Status não substitui explicação: ao surgir uma nova necessidade de decisão, volte a DECISION e explique o significado da etapa e a origem da necessidade antes da pergunta.

## Proveniência e cadeia de origem

Use labels quando evitarem ambiguidade, sem poluir todas as respostas:

| Label na conversa | Significado e limite |
|---|---|
| `[APPROVED]` | Já aprovado por humano, somente no escopo demonstrado pela fonte. |
| `[PROVISIONAL]` | Escolha autônoma sujeita a validação; corresponde a `AGENT-PROVISIONAL`. |
| `[DEPENDENCY]` | Consequência técnica necessária de uma decisão aprovada; não concede autorização de instalação ou execução. |
| `[NEW PROPOSAL]` | Nova decisão ainda não aprovada. |
| `[BLOCKER]` | Impedimento real ao próximo passo identificado; não bloqueia trabalho independente permitido. |

Labels são explicações, não novos estados do ledger. Preserve `ACCEPTED`, `AGENT-PROVISIONAL`, `NEEDS-HUMAN-DECISION`, `REJECTED` e `SUPERSEDED` e a matriz da [política de autonomia](AUTONOMY-POLICY.md).

Para tecnologia, arquitetura, dependência ou comportamento importante cuja origem não seja óbvia, mostre a cadeia de origem com fontes e limites. O usuário não deveria precisar perguntar “Quando eu aprovei isso?”. Se faltar evidência de aprovação, exponha a lacuna; não invente a cadeia.

Exemplo condicionado à autorização registrada: G4 autorizado → ADR-0001 propõe Tauri/Rust para o spike → Tauri usa Rust → toolchain fornece rustc/Cargo → toolchain necessário para executar o spike. Instalar o toolchain continua sujeito à autorização de dependências e não aprova arquitetura de produção.

## Fronteira de autonomia

DEC-038 continua válida: matriz confiança × impacto, AUTO, `AGENT-PROVISIONAL`, ASK-FIRST e validação humana em lote permanecem funcionais.

- **IMPLEMENTATION DETAIL:** escolha técnica interna de baixo impacto, local e reversível, dentro do comportamento aprovado; pode seguir AUTO ou `AGENT-PROVISIONAL` conforme a matriz, com registro proporcional.
- **PRODUCT BEHAVIOR:** escolha que altera como a pessoa percebe ou usa o produto; requer discovery adequado sobre lacunas relevantes mesmo quando a recomendação técnica parece clara. Fluxos, mensagens com significado funcional, estados vazios, erros e recuperação podem pertencer a esta categoria.

Autonomia técnica não elimina discovery de produto. Não reabra comportamento já aprovado; se houver mudança ou lacuna relevante, investigue antes de consolidar. Recomendação não equivale a aprovação. Um detalhe com efeito percebido deve ter esse efeito analisado antes de ser tratado como implementação. Não é obrigatório perguntar sobre toda microescolha; é obrigatório compreender o comportamento relevante.

## Qualidade antes de READY FOR IMPLEMENTATION

Na revisão de planejamento, verifique com evidências nas conversas e nos artefatos:

- comportamento descrito de forma compreensível pelo humano;
- decisões relevantes discutidas, com origem e impacto claros;
- perguntas importantes respondidas;
- critérios de aceite compreensíveis e verificáveis;
- ausência de suposições silenciosas sobre produto.

Se houver lacuna material, retorne ao discovery/decisão pertinente antes de declarar `READY FOR IMPLEMENTATION`. Pendências técnicas provisórias permitidas continuam seguindo Human Decision Review. Esta checagem integra os gates existentes: não cria aprovação extra, não equivale a Implementation Approval e não enfraquece Sensitive Change Approval ou Final Approval.

## Saída para o humano

Em trabalho já autorizado, avance até concluir o escopo ou alcançar um bloqueio real; não encerre o turno apenas para pedir a invocação da próxima skill ou anunciar uma transição de fase. Faça perguntas somente sobre lacunas materiais que ainda não tenham resposta. Agrupe decisões relacionadas dentro dos gates existentes, com o escopo de cada autorização claro. Enquanto uma resposta estiver pendente, continue o trabalho independente permitido. Use atualizações breves sobre resultado, incerteza e próximo passo, sem transformar o fluxo interno em uma sequência de aprovações.

Mostre o que ajuda a compreender, decidir, acompanhar e validar: progresso breve, significado da etapa, motivo da necessidade e decisão necessária. Mantenha IDs internos, logs extensos, listas enormes de gates e raciocínio operacional nos artefatos apropriados. Cite um ID/ADR ou detalhe técnico quando ele esclarecer origem, evidência ou ação necessária. Não oculte bloqueadores, limitações ou decisões provisórias relevantes.

## Integração e manutenção

Aplicar na skill local e nos prompts de intake, planejamento, decisão, execução e review. O Spec Kit permanece a fonte operacional dos artefatos; não modificar suas skills oficiais nem duplicar seus workflows. O agrupamento de perguntas orienta o discovery do harness; ao executar uma skill oficial, respeitar seu protocolo de perguntas e fornecer o contexto humano necessário sem alterar a skill.

Fonte: solicitação humana do HUMAN INTERACTION CONTRACT nesta tarefa. Ver [governança](GOVERNANCE.md), [autonomia](AUTONOMY-POLICY.md) e [evidência da atualização](evidence/human-interaction-contract-2026-09-17.md).
