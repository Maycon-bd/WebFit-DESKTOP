<!--
Sync Impact Report
- Version change: template -> 1.0.0
- Added principles: I through X (first project Constitution)
- Added sections: Engineering Constraints; Development Workflow and Quality Gates
- Removed sections: none
- Template compatibility reviewed: spec, plan, tasks, checklist, and agent guidance
- Follow-up items: none
-->

# WebFit Desktop Constitution

## Core Principles

### I. Specification Before Implementation
Toda mudança não trivial MUST possuir contexto, escopo, requisitos identificados e critérios de aceite suficientes antes da implementação. Nenhum agente pode iniciar implementação de requisito sem ID, status aprovado e rastreabilidade. Descobertas e propostas MUST permanecer explicitamente distintas de requisitos aprovados.

### II. Evidence Before Completion
Produção de código, por si só, não caracteriza conclusão. Build, testes, critérios de aceite, Verification independente, Review independente e Evidence Report MUST ser aplicados proporcionalmente ao risco e registrar também limitações, itens não verificados e riscos residuais. Evidência MUST apontar requisito e versão ou commit quando existirem.

### III. Decisions Are Explicit
Decisões materiais de produto, arquitetura, segurança, dados, integração e processo MUST ser registradas no Decisions Register e, quando arquiteturais, em ADR. Inferências, hipóteses e recomendações MUST NOT ser apresentadas como decisões aceitas. Estados `ACCEPTED`, `AGENT-PROVISIONAL`, `NEEDS-HUMAN-DECISION`, `REJECTED` e `SUPERSEDED` MUST preservar autoridade e histórico.

### IV. Autonomous Decision With Human Validation
Conforme DEC-038, agentes MAY escolher uma alternativa claramente superior quando a política de autonomia permitir, registrar a escolha como `AGENT-PROVISIONAL` e continuar sem interromper o fluxo por decisões pequenas. Condições ASK-FIRST, informação material ausente, alternativas equilibradas e decisões sensíveis MUST gerar decisão humana. Decisões provisórias MUST permanecer visíveis e ser validadas em lote; nunca equivalem a aprovação humana.

### V. Security and Privacy by Design
Dados de saúde e demais dados sensíveis, autenticação, autorização, privacidade e auditoria MUST ser considerados desde a especificação e a arquitetura. Toda operação protegida MUST ser autorizada na fronteira de confiança apropriada; ocultar interface não constitui autorização. Segredos, credenciais e dados clínicos MUST NOT ser expostos em frontend, repositório, logs ou evidências. Segurança MUST NOT ser enfraquecida para facilitar implementação.

### VI. Minimal Sufficient Complexity
A solução escolhida MUST ser a mais simples que satisfaça corretamente requisitos e restrições conhecidos, incluindo segurança, integridade, disponibilidade e manutenção. Camadas, serviços, dependências, bancos, filas e abstrações adicionais MUST possuir justificativa concreta. Simplicidade não autoriza ignorar requisitos conhecidos nem antecipar arquitetura de produção sem evidência.

### VII. Reuse and Consistency
Padrões, componentes, convenções e soluções existentes SHOULD ser reutilizados antes da criação de alternativas paralelas. Novas abstrações MUST possuir responsabilidade clara e demanda concreta. A documentação e a implementação MUST usar terminologia canônica e preservar consistência entre interface, domínio, persistência, erros e testes.

### VIII. Controlled Change
Escopo, requisito, arquitetura, contrato, schema, segurança, autorização, integração e infraestrutura MUST NOT ser ampliados ou alterados silenciosamente. Mudanças sensíveis MUST retornar ao gate aplicável e obter a autorização exigida. Trabalho preexistente MUST ser preservado, e ações destrutivas, dependências, commit, push e deploy MUST seguir autorização explícita e políticas do projeto.

### IX. Traceability
Rastreabilidade proporcional ao risco MUST ligar requisito, decisão, specification, plan, task, implementação, teste, verification, review e evidence. Mudanças de comportamento MUST atualizar documentação e evidência na mesma entrega. Lacunas de ligação MUST ser registradas antes de considerar o trabalho concluído.

### X. Human Accountability
A IA MAY pesquisar, recomendar, decidir provisoriamente, planejar, implementar e verificar dentro das políticas aprovadas. Responsabilidade por decisões sensíveis, validação de decisões provisórias, aprovação de implementação quando exigida e aprovação final permanece humana. Nenhum agente pode representar silêncio, inferência ou execução bem-sucedida como consentimento humano.

## Engineering Constraints

- O projeto permanece Windows-first, local e offline no MVP; mudanças nessa direção exigem decisão explícita.
- Dados de saúde são sensíveis. Proteção local, autorização, auditoria, backup, restauração, retenção e migração MUST ser avaliados quando a mudança tocar dados.
- A composição Tauri 2, React, TypeScript, Vite, Rust e SQLite está aprovada somente para spike pelo ADR-0001 e MUST NOT ser tratada como arquitetura de produção antes da evidência e aprovação previstas.
- Dependências novas, schema, migrations, autenticação, integrações externas, infraestrutura, produção e mudanças arquiteturais materiais são condições ASK-FIRST.
- Valores monetários MUST usar inteiros em centavos; instantes persistidos MUST usar UTC; consultas MUST ser parametrizadas; conexões SQLite MUST habilitar foreign keys; backup de banco ativo MUST usar snapshot consistente e restauração MUST verificar integridade.
- Código, logs, documentos e evidências MUST NOT conter segredos nem dados clínicos reais.

## Development Workflow and Quality Gates

- AGENTS.md fornece contexto permanente e regras operacionais; o harness conduz intake, investigação, decisões, gates, Verification, Review e Evidence; o Spec Kit conduz Constitution, Specification, Clarify, Plan, Checklist, Tasks, Analyze, Implement e Converge.
- O nível LIGHT, STANDARD ou STRICT MUST ser escolhido conforme risco e impacto, sem dispensar a governança. Segurança, autorização, dados clínicos, privacidade, financeiro, schema, migrations, infraestrutura, arquitetura e integrações sensíveis exigem STRICT.
- Clarify e interrupção humana SHOULD ocorrer somente quando a ausência for material, ASK-FIRST se aplicar, alternativas forem equilibradas ou a decisão for sensível. Alternativas claramente superiores e permitidas por DEC-038 SHOULD seguir como `AGENT-PROVISIONAL` registrado.
- Antes de implementação, artefatos aplicáveis MUST passar por análise de consistência e pelo Human Gate definido no harness. Após implementação, Converge, Verification, Review, gates condicionais e Evidence MUST ser executados conforme o risco.
- Security Gate depende de código e risco relevante; UI/UX Gate depende de interface existente; loops dependem de checks objetivos e implementação real. Enquanto essas condições não existirem, permanecem `PREPARED — NOT ACTIVE`.
- Nenhum fluxo automatizado MAY fazer commit, push, deploy ou release sem aprovação humana explícita.

## Governance

Esta Constitution define princípios estáveis de engenharia e governança. Ela não substitui requisitos, documentação canônica, ADRs, Decisions Register, AGENTS.md ou políticas detalhadas do harness.

Quando houver conflito, aplicar a precedência: (1) decisão humana explicitamente `ACCEPTED`; (2) ADR `ACCEPTED`; (3) requisito ou documentação canônica aprovada; (4) esta Constitution; (5) Specification, Plan e Tasks da feature; (6) código; (7) evidência de execução. Um artefato inferior MUST ser corrigido ou a mudança MUST ser submetida à autoridade superior; evidência demonstra o ocorrido, mas não redefine intenção.

Alterações nesta Constitution exigem decisão humana explícita, justificativa, análise de impacto e atualização da versão. Agentes MUST NOT alterá-la silenciosamente. Mudança incompatível de princípio ou governança incrementa MAJOR; princípio ou seção normativa nova, ou expansão material compatível, incrementa MINOR; esclarecimento sem mudança semântica incrementa PATCH.

Conformidade constitucional MUST ser revisada durante Specification, Plan, análise pré-implementação, Review e Evidence. Exceções exigem decisão humana registrada; não podem ser criadas por conveniência local.

**Version**: 1.0.0 | **Ratified**: 2026-09-11 | **Last Amended**: 2026-09-11
