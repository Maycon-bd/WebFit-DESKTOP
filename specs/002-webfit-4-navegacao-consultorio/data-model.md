# UI state — WEBFIT-4

Nenhuma entidade persistida ou mudança SQLite. Os dados de paciente, rascunho, perfil e sessão continuam conforme requisitos existentes.

| Estado | Valores | Transição/validação |
|---|---|---|
| sidebarOpen | boolean; inicialmente true, ACCEPTED D-NAV-001 | hambúrguer alterna; recolher fecha accountOpen; não muda page/formulário/sessão |
| accountOpen | boolean; inicialmente false | nome alterna; Escape fecha; selecionar destino fecha após navegação segura; ocultar sidebar fecha |
| page | patients/profile/audit/backup/access/settings | destinos via navigate; must_change continua impondo AccessPage |

Relações: sidebar recolhida implica accountOpen false e controles laterais não focáveis. settings é índice; audit/backup só montam quando page seleciona a ferramenta. UpdatePanel continua montado por session.token no conteúdo. Sem persistência de preferência ou localStorage.
