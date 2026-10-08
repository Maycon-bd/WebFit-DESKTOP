# WEBFIT-6 — Pesquisa local

2026-10-08. Pesquisa delegada pela skill speckit-plan ao agente info_research, somente leitura; não constitui Review independente da implementação.

## Decisão técnica

- **Decision**: reutilizar LoginInfo nos dois shells, com onAdmin opcional e seção administrativa condicionada. Posicionamento fixo compartilhado; reservar ao menos 68 px inferiores e confirmar por ensaio.
- **Rationale**: `src/LoginInfo.tsx` já tem versão Tauri, mensagem de falha, SVG decorativo, botão 44×44, nome acessível, diálogo nativo e fechamento. `src/App.tsx` monta somente no retorno sem sessão. Montagem como irmão de workspace-main cobre páginas e troca obrigatória de senha sem remontar formulários. `src/style.css` usa footer absoluto no login e padding inferior de 50 px/30 px no workspace; fixar sem reserva pode encobrir controles. Tours usam camadas 100–102.
- **Alternatives considered**: duplicar painel em cada página aumenta manutenção; montar em cada formulário pode remontá-lo; botão fixo sem reserva pode encobrir controles; infraestrutura nova de modal é desnecessária.
- **Status**: detalhe técnico proposto, reversível, confiança alta, risco baixo; não requer ADR novo.

## D-INFO-001 — conteúdo durante sessão

- **Decision**: recomendar nome/versão/crédito/Fechar nas telas internas; Acesso do administrador somente no login.
- **Rationale**: consulta não exige sair ou trocar sessão. Callback atual apenas muda adminAccess, efetivo no retorno sem sessão; mantê-lo internamente sem definir novo fluxo criaria ação sem efeito.
- **Alternatives considered**: opção administrativa interna exigiria definir saída e preservação de rascunhos, ampliando escopo; omitir ícone contraria pedido.
- **Status**: AGENT-PROVISIONAL; pergunta apresentada a Maycon, validação pendente. Confiança alta, impacto baixo, risco baixo, reversível. Ausência de resposta não é aprovação.

## Limites

Sem APIs novas, dependências ou consulta externa. Base é implementação vigente e requisitos canônicos. Falha de versão, foco, tour, busy e redimensionamento pertencem aos ensaios de execução.
