# HUMAN INTERACTION CONTRACT

Status: vigente por solicitação humana de 2026-09-17; comunicação e continuidade refinadas por solicitação de Maycon em 2026-10-07. Escopo: conversas do harness e da skill local `webfit-task`; não altera requisitos, arquitetura, autoridades ou gates do WebFit.

**Concise does not mean context-free.** Status e execução devem ser concisos; decisões precisam de contexto suficiente para a pessoa compreender sua escolha. Nunca reduzir uma decisão humana a uma pergunta sem explicar o necessário. O objetivo da `webfit-task` é chegar a uma especificação que o humano compreenda e considere correta, com registro proporcional, sem cadeia obrigatória de artefatos Spec Kit.

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

## Qualidade no Plan Scope Check

Na revisão de planejamento, verifique com evidências nas conversas e nos artefatos:

- comportamento descrito de forma compreensível pelo humano;
- decisões relevantes discutidas, com origem e impacto claros;
- perguntas importantes respondidas;
- critérios de aceite compreensíveis e verificáveis;
- ausência de suposições silenciosas sobre produto.

Se houver lacuna material, retorne ao discovery/decisão pertinente antes de declarar `PLAN APPROVED BY SCOPE`. Pendências técnicas provisórias não bloqueantes podem seguir para validação humana em lote no aceite final. Esta checagem interna não cria aprovação extra; pedido explícito suficiente autoriza execução no escopo. Aprovações específicas para mudanças sensíveis, domínio e aceite final permanecem.

## Saída para o humano

### Colaboração e continuidade

Atue como colega que ajuda a conduzir o trabalho: explique o que o resultado significa, ofereça recomendações fundamentadas quando ajudarem a avançar e explicite as decisões necessárias. Concisão deve eliminar repetição, não informação útil. Não dependa de uma troca de persona para cumprir este contrato.

Ao encerrar trabalho material, comunique em linguagem comum a fase atual da demanda, o que foi efetivamente concluído (registro, planejamento, implementação ou verificação), o que falta e a próxima ação concreta. Distinga a fase da demanda do estágio geral do projeto quando isso evitar confusão. Adapte o tamanho à situação; não transforme esses elementos em formulário fixo. Uma resposta factual simples durante execução pode ser curta, mas deve conectar um impedimento à ação que o resolve.

Antes de parar, confira se existe ação necessária e já autorizada que possa executar. Se existir, execute-a no mesmo turno; ausência de aprovação pendente não é motivo para encerrar entre fases. Reaproveite respostas e autorizações anteriores dentro de seu escopo. Uma escolha de interface não autoriza automaticamente commit, mudança de política Git ou aprovação integral da demanda.

Quando houver bloqueio, identifique a condição concreta e sua fonte, delimite o trabalho impedido, conclua o trabalho independente permitido e apresente uma saída recomendada com suas consequências. Se depender do humano, formule a pergunta que permita resolver a condição; não encerre apenas com “está bloqueado” ou “precisamos resolver”. Ao receber resposta parcial, incorpore-a e direcione a conversa para a lacuna restante, sem repetir perguntas respondidas.

Sugestões e perguntas devem servir ao objetivo atual. Não force uma pergunta ao final de toda entrega, não acrescente escopo sem autorização e não use “posso continuar?” quando já puder continuar. Se o escopo estiver concluído, diga isso e mencione uma oportunidade concreta somente quando houver benefício claro.

Exemplo vigente após DEC-054: uma nova demanda de UI compartilha a branch atual com outras alterações. Isso não constitui bloqueio: preserve o trabalho e avance no escopo autorizado. Se duas alterações concretas no mesmo conteúdo forem incompatíveis e a intenção não puder ser recuperada, explique a incompatibilidade e pergunte qual comportamento deve prevalecer, bloqueando somente a edição dependente. Git permanece sob controle humano.

Em trabalho já autorizado, avance até concluir o escopo ou alcançar um bloqueio real; não encerre o turno apenas para pedir a invocação da próxima skill ou anunciar uma transição de fase. Faça perguntas somente sobre lacunas materiais que ainda não tenham resposta. Agrupe decisões relacionadas dentro dos gates existentes, com o escopo de cada autorização claro. Enquanto uma resposta estiver pendente, continue o trabalho independente permitido. Use atualizações breves sobre resultado, incerteza e próximo passo, sem transformar o fluxo interno em uma sequência de aprovações.

Mostre o que ajuda a compreender, decidir, acompanhar e validar: progresso breve, significado da etapa, motivo da necessidade e decisão necessária. Identifique o ID Plane da demanda nos resumos; mantenha demais IDs internos desnecessários, logs extensos, listas enormes de gates e raciocínio operacional nos artefatos apropriados. Cite um ID/ADR ou detalhe técnico quando ele esclarecer origem, evidência ou ação necessária. Não oculte bloqueadores, limitações ou decisões provisórias relevantes.

## Phase Summary — Resumo Executivo por Fase

Política autorizada por Maycon em 2026-10-08: documentação completa nos arquivos, resumos verificáveis no chat e continuidade automática. É saída das fases existentes, sem quinta fase, arquivo exclusivo de resumo ou Approval Gate adicional.

### Momento e proporcionalidade

STANDARD/STRICT: ao terminar cada fase, publicar seu resumo imediatamente no chat, antes de iniciar a seguinte; não juntar os quatro apenas no final. Preferir 5–10 linhas, título e bullets curtos em português brasileiro. STRICT pode detalhar riscos/controles e decisões sensíveis, sem secrets, dados pessoais ou clínicos.

LIGHT: uma ação breve pode reunir resultados das fases numa mensagem curta de alteração/revisão, sem quatro relatórios extensos. Essa exceção não autoriza silêncio em trabalho demorado ou bloqueio. Retomadas resumem a fase efetivamente trabalhada, sem reconstruir fases válidas só para produzir mensagens.

Bloqueio: emitir resumo parcial com status BLOCKED/decisão necessária, fatos confirmados, pendência e próxima ação, antes de pausar o dependente; não declarar conclusão. Continuar independente autorizado, sem “Posso continuar?” quando já houver autorização. Durante fases demoradas, informar progresso útil sem narrar cada comando ou repetir status vazio.

### Conteúdo dos resumos

| Fase | Cobertura proporcional obrigatória |
|---|---|
| Discovery Summary | Status; problema; comportamento atual; resultado esperado; escopo/componentes; risco; dúvidas/limites; documento criado/atualizado ou ausência |
| Plan Summary | Status; abordagem; arquivos/componentes; mudanças funcionais; impacto em banco/segurança/integrações; testes previstos; riscos/decisões; Plan Scope Check; documento |
| Execution Summary | Status; implementação efetiva; arquivos criados/modificados; comportamento; testes executados/resultados; pendências do Plan; desvios/limites |
| Code Review Summary | Status geral; Correctness; testes/build/typecheck/lint; Security/UI aplicáveis; findings identificados/corrigidos/abertos; riscos/limites; resultado final conforme governança |

Usar título com ID Plane quando houver, por exemplo **WEBFIT-12 — PLAN COMPLETE**; sem ID, não inventá-lo. O título comunica progresso, enquanto o resultado de autoridade permanece o Plan Scope Check. Resumos não autorizam escritas extras nem mudança de estado por mensagem; sincronização Plane mantém seu contrato.

### Evidência e estados

- **PASS:** avaliação/check realizado, ou evidência anterior válida explicitamente referenciada, satisfez o critério.
- **FAIL:** avaliação/check realizado falhou; indicar impacto e próximo passo.
- **WARNING:** ressalva não impeditiva com risco/limite; não esconder finding bloqueante.
- **NOT RUN:** aplicável mas não executado/verificado; informar motivo e efeito na prontidão.
- **NOT APPLICABLE:** fora do escopo, com justificativa; N/A interno deve aparecer com esse significado claro no chat.

Teste planejado não é executado; análise estática não é ensaio visual ou aprovação clínica. Nunca inventar execução, aceite, atualização documental ou prontidão. Resultado final: READY TO SHIP, REVIEW PASSED WITH WARNINGS ou CHANGES REQUIRED conforme governança, incluindo revisão independente e bloqueadores. Security/UI não verificados jamais recebem PASS por inferência.

### Documentação atualizada

Sempre que a fase gravar documentação, incluir bloco curto **Documentação atualizada**: nome/caminho clicável, criado/modificado e uma frase do conteúdo realmente gravado. Muitos arquivos são agrupados por Frontend, Backend, Banco, Testes ou Harness/documentação conforme aplicável; mostrar principais e apontar inventário completo existente. Não despejar caminhos, copiar Specification/Plan ou criar arquivo só para guardar o resumo.

Documentos só consultados/reaproveitados sem edição não são atualizados; quando útil, declarar ausência de criação/modificação naquela fase. Documentação completa continua nas fontes existentes, com profundidade proporcional, sem duplicação no chat/Plane.

## Integração e manutenção

Aplicar na skill local e nos prompts de intake, planejamento, decisão, execução e review. As quatro fases são orquestradas por webfit-task; Spec Kit permanece disponível para artefatos detalhados quando úteis ou solicitado. Não modificar suas skills oficiais nem impor seu workflow completo por rotina. O agrupamento de perguntas orienta o discovery do harness; ao executar uma skill oficial, respeitar seu protocolo de perguntas e fornecer o contexto humano necessário sem alterar a skill.

Fonte: solicitação humana do HUMAN INTERACTION CONTRACT nesta tarefa. Ver [governança](GOVERNANCE.md), [autonomia](AUTONOMY-POLICY.md) e [evidência da atualização](evidence/human-interaction-contract-2026-09-17.md).
