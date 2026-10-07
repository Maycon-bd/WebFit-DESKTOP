# WebFit Engineering Harness

Este diretório é o harness de engenharia do WebFit Desktop. Organiza contexto, governança, prompts, templates, integrações e evidências sem criar uma segunda fonte de requisitos ou decisões.

O modelo decisório está em [AUTONOMY-POLICY.md](AUTONOMY-POLICY.md): escolhas justificáveis podem avançar como `AGENT-PROVISIONAL`, sempre visíveis e sujeitas a validação humana posterior; condições ASK-FIRST continuam exigindo decisão prévia.

## Interação humana

O [HUMAN INTERACTION CONTRACT](HUMAN-INTERACTION-CONTRACT.md) rege a comunicação: **Concise does not mean context-free.** DISCOVERY investiga produto em rodadas de 2–4 perguntas relacionadas; DECISION explica origem, opções e impacto antes da pergunta; EXECUTION comunica ação, resultado, evidência e próximo passo de forma breve. DEC-038 e os gates continuam válidos; autonomia técnica não substitui discovery de comportamento de produto. A revisão anterior a `READY FOR IMPLEMENTATION` também verifica se a especificação é compreensível para o humano.

## Estado

PROJECT STAGE: PLANNING. Spec Kit e `$webfit-task` estão integrados; a proteção local de branches corrige a lacuna encontrada no smoke test. Plane está ACTIVE somente como camada controlada de gestão do trabalho; MCP/Plane usa OAuth, leitura validada e escrita limitada ao Work Item da execução atual de `$webfit-task`. Obsidian está ACTIVE somente como camada de navegação e conhecimento sobre os mesmos arquivos locais; não é fonte paralela da verdade e não requer MCP. As demais integrações externas e automação permanecem PREPARED — NOT ACTIVE. O repositório não contém código de aplicação.

## Fluxo oficial

IDEA / DEMANDA
↓ INTAKE
↓ PLANE INTAKE / WORK ITEM, para STANDARD ou STRICT reais
↓ RESEARCH, quando necessário
↓ BRANCH SAFETY: ID + STATUS + WORKTREE + BASE + BRANCH LOCAL
↓ $speckit-specify
↓ $speckit-clarify, quando necessário
↓ ARCHITECTURE REVIEW / ADR, quando necessário
↓ $speckit-plan
↓ $speckit-checklist, quando apropriado
↓ $speckit-tasks
↓ $speckit-analyze
↓ HUMAN GATE
↓ $speckit-implement
↓ $speckit-converge
↓ HARNESS VERIFICATION
↓ HARNESS REVIEW
↓ SECURITY GATE, quando aplicável
↓ UI/UX GATE, quando aplicável
↓ EVIDENCE
↓ HUMAN APPROVAL
↓ COMMIT / PR / RELEASE

Uma alteração documental simples pode ser LIGHT; uma feature comum é STANDARD; arquitetura, autenticação, dados sensíveis, migração, infraestrutura ou segurança são STRICT. Mudança sem UI não requer UI Review, documentação pura não requer Implementation e autenticação requer Security Review.

## Uso rápido

Use `$webfit-task` para uma demanda, `$webfit-checkpoint` para retomar/salvar e `$webfit-verificar` para verificar mudanças. As auxiliares cumprem responsabilidades já existentes e não acrescentam gates. Ver [skills locais](integrations/codex-skill.md).

Comece pela primeira etapa pendente, conforme o checkpoint, e aplique a [condução proporcional](GOVERNANCE.md#condução-proporcional-e-retomada). O diagrama acima descreve o ciclo completo de uma demanda; ele não manda reiniciar o ciclo a cada conversa. LIGHT documental usa fonte, alteração, revisão e evidência breve. Nas demais demandas, reutilize artefatos válidos e execute as skills da fase atual no mesmo chat. Perguntas e gates condicionais exigem um motivo concreto.

1. Ler PROJECT-STATE.md, GOVERNANCE.md e os documentos canônicos relacionados.
2. Classificar a demanda, aplicar a matriz de autonomia e distinguir fato, inferência, `AGENT-PROVISIONAL` e `NEEDS-HUMAN-DECISION`.
3. Para STANDARD ou STRICT real, concluir o Branch Safety antes de criar qualquer alteração versionável; se não for seguro, parar em `BRANCH SETUP BLOCKED`.
4. Usar `$webfit-task` como entrypoint e as skills oficiais `$speckit-*` para criar ou atualizar os artefatos canônicos da feature.
5. Obter o gate humano antes de condições ASK-FIRST; decisões provisórias não sensíveis podem sustentar especificação, plano e review.
6. Executar verificação, review independente e gates condicionais.
7. Produzir um Evidence Report antes da aprovação final.

Os prompts são instruções reutilizáveis, não agentes autônomos. As integrações descrevem contratos e status; nenhuma integração externa é ativada por este harness.

Produto, requisitos, regras, UX, arquitetura e ADRs existentes continuam em docs/. A separação completa está em [integrations/spec-kit.md](integrations/spec-kit.md). O `README.md` é o entrypoint humano principal; `docs/` e `specs/` permanecem navegáveis pelo Obsidian. Plane gerencia trabalho; Obsidian navega e organiza conhecimento; MCP integra; Mantis e Impeccable são gates especializados. Não copiar conteúdo de `.harness/` para `docs/` só para torná-lo visível, não instalar plugins comunitários nem ativar Sync automaticamente, e não criar nova estrutura documental sem necessidade. Alterações feitas no Obsidian são alterações reais nos arquivos do repositório e seguem a política normal do Git. Plane não substitui a fonte canônica nem recebe cópias integrais de Specification, Plan, Tasks ou Evidence.

O contrato da integração está em [integrations/obsidian.md](integrations/obsidian.md). A configuração local existente em `.obsidian/` é recomendada fora do Git enquanto não houver decisão explícita para compartilhá-la; ela não deve ser removida ou sobrescrita automaticamente.
