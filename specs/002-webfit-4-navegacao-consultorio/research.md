# Research — WEBFIT-4

Pesquisa local de speckit-plan em 2026-10-07; subagente navigation_research somente leitura. Fontes: src/App.tsx, src/style.css, src/GuidedTour.tsx, src/onboarding.ts, src/UpdatePanel.tsx e tests/unit/onboarding.test.ts.

## Decisions

- Decision: manter estado/navegação React e adicionar settings como destino de índice. Rationale: todas as páginas já coexistem em App e navigate salva rascunhos. Alternatives: router novo rejeitado por custo e mudança desnecessária; montar audit/backup juntos rejeitado porque auditaria acesso antes da escolha.
- Decision: nome como disclosure com botões normais e engrenagem independente. Rationale: teclado simples com aria-expanded/controls, sem role menu e protocolo de setas não implementado. Alternatives: nova tela de conta/modal aumenta passos/foco. D-NAV-002, ACCEPTED por Maycon em 2026-10-07; confiança alta, impacto médio, reversível.
- Decision: lateral inicialmente aberta e estado transitório. Rationale: não há pedido de persistência e estado local preserva âmbito frontend. Alternatives: preferência durável exigiria persistência adicional. D-NAV-001, ACCEPTED por Maycon em 2026-10-07; confiança alta, impacto baixo, reversível.
- Decision: manter UpdatePanel no workspace-main e chave session.token. Rationale: recolher não pode perder aviso/progresso nem repetir consulta. Alternatives: mover ao contêiner ocultável rejeitado.
- Decision: hambúrguer como alvo estável do tour geral; corrigir seletor amplo de logout. Rationale: .sidebar nav pode estar oculto e .sidebar-bottom button apontaria à conta. Configurações não cria TourId: omitir tour no índice e preservar tours das ferramentas. Alternatives: reabrir menu automaticamente violaria intenção de recolhimento; novo tour persistido amplia escopo.

## Risks and Constraints

CSS possui grid no desktop e display block em janela estreita; remover coluna em ambos. Controles ocultos fora do foco. Navegação respeita busy/must_change e falha ao salvar rascunho não muda destino. Saúde é domínio aprovado, Consultório apenas grupo visual. Não há comando Tauri novo, migração, dependency, credencial ou preferência persistida.

## Resolution

Sem NEEDS CLARIFICATION. Duas decisões apresentadas em lote e ACCEPTED por Maycon em 2026-10-07 junto à aprovação de execução. Arquitetura/ADR adicional e Security Gate de mudança sensível não são disparados por simples reorganização; regressões de segurança existentes precisam ser preservadas.
