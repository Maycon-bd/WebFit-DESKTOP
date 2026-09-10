# WebFit Engineering Harness

Este diretório é o harness de engenharia do WebFit Desktop. Organiza contexto, governança, prompts, templates, integrações e evidências sem criar uma segunda fonte de requisitos ou decisões.

O modelo decisório está em [AUTONOMY-POLICY.md](AUTONOMY-POLICY.md): escolhas justificáveis podem avançar como `AGENT-PROVISIONAL`, sempre visíveis e sujeitas a validação humana posterior; condições ASK-FIRST continuam exigindo decisão prévia.

## Estado

PROJECT STAGE: PLANNING. Integrações externas e automação estão PREPARED — NOT ACTIVE. O repositório não contém código de aplicação.

## Fluxo oficial

IDEA / DEMANDA
↓ INTAKE
↓ RESEARCH / CLARIFICATION
↓ SPEC KIT
↓ SPEC
↓ ARCHITECTURE / ADR
↓ PLAN
↓ TASKS
↓ HUMAN GATE ou READY FOR HUMAN DECISION REVIEW, conforme risco
↓ IMPLEMENTATION
↓ VERIFICATION
↓ INDEPENDENT REVIEW
↓ SECURITY GATE, quando aplicável
↓ UI/UX REVIEW, quando aplicável
↓ EVIDENCE
↓ HUMAN APPROVAL
↓ COMMIT / PR / RELEASE

Uma alteração documental simples pode ser LIGHT; uma feature comum é STANDARD; arquitetura, autenticação, dados sensíveis, migração, infraestrutura ou segurança são STRICT. Mudança sem UI não requer UI Review, documentação pura não requer Implementation e autenticação requer Security Review.

## Uso rápido

1. Ler PROJECT-STATE.md, GOVERNANCE.md e os documentos canônicos relacionados.
2. Classificar a demanda, aplicar a matriz de autonomia e distinguir fato, inferência, `AGENT-PROVISIONAL` e `NEEDS-HUMAN-DECISION`.
3. Criar ou atualizar a Spec Kit canônica quando a ferramenta estiver disponível.
4. Obter o gate humano antes de condições ASK-FIRST; decisões provisórias não sensíveis podem sustentar especificação, plano e review.
5. Executar verificação, review independente e gates condicionais.
6. Produzir um Evidence Report antes da aprovação final.

Os prompts são instruções reutilizáveis, não agentes autônomos. As integrações descrevem contratos e status; nenhuma integração externa é ativada por este harness.

Produto, requisitos, regras, UX, arquitetura e ADRs existentes continuam em docs/. Plane gerencia trabalho; Obsidian navega; MCP integra; Mantis e Impeccable são gates especializados.