# UI contract — WEBFIT-4

| Controle/origem | Resultado | Critério |
|---|---|---|
| Hambúrguer sempre visível | alternar toda a lateral, sem navegação | FR-001/008, TA-UX-NAV-001/007 |
| Consultório / Pacientes | destino patients via navigate | FR-002/006, TA-UX-NAV-002 |
| Engrenagem junto ao nome | destino settings via navigate | FR-003, TA-UX-NAV-003 |
| Settings / Auditoria | destino audit; retorno ao índice | FR-004/006, TA-UX-NAV-004 |
| Settings / Backup e restauração | destino backup; retorno ao índice | FR-004/006, TA-UX-NAV-004 |
| Nome do usuário | disclosure com Acesso e Perfil profissional | FR-005/008, TA-UX-NAV-005/007 |
| Opção Acesso / Perfil | access/profile via navigate | FR-005/006, TA-UX-NAV-005/006 |
| Escape nas opções | fechar e focar nome | FR-008, TA-UX-NAV-007 |

Labels acessíveis: Abrir menu/Fechar menu, Configurações e opções do usuário; ícones decorativos não duplicam nomes. aria-expanded/controls no hambúrguer e nome; aria-current no destino ativo. Não usar role menu sem navegação completa correspondente. Destinos desabilitados por busy/must_change preservam política existente; toggles não executam domínio.

Bloquear troca quando save_draft falhar; preservar dados e erro. Abrir índice não chama audit_open, backup ou restauração. Mantêm-se filtros/resultados/confirmar/restaurar/logout. Tour geral possui alvo sempre visível; controles ocultos não são selecionados. Atualização não desmonta durante toggles e mantém bloqueios atuais.
