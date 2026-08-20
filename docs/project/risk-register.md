# Registro de riscos

Escalas de probabilidade e impacto serão definidas no planejamento. Até lá, não atribuir pontuações arbitrárias.

| ID | Risco | Categoria | Resposta/ação | Dono | Gate | Estado |
|---|---|---|---|---|---|---|
| RSK-001 | escopo não validado pode produzir MVP sem foco | produto | G1 aprovado para Saúde; revisar nas Sprint Reviews | Maycon/Amanda | G1 | mitigado |
| RSK-002 | Tauri, SQLite, criptografia ou empacotamento podem exigir retrabalho | técnico/segurança | executar spike mensurável do ADR-0001 | Maycon | G4 | aberto |
| RSK-003 | proteção incoerente de banco, arquivos, assinatura, rascunhos ou chaves pode expor dados de saúde | segurança/privacidade | modelo de ameaças, proteção local e testes antes de dados reais | Maycon | G4/G7 | aberto |
| RSK-004 | backup recente pode não ser restaurável | operação | validar checksum/integridade, restaurar em teste e exercitar falhas | Maycon/Amanda | G4/G6/G7 | aberto |
| RSK-005 | regras legadas ou clínicas incompletas podem ser implementadas como fatos | produto | implementar somente itens aprovados e validar fórmulas com Amanda | Amanda | G2 | monitorado |
| RSK-006 | necessidade futura de múltiplos computadores pode invalidar SQLite local | arquitetura | reabrir ADR antes de sincronização | Maycon | revisão contínua | monitorado |
| RSK-007 | ausência de Git pode eliminar histórico e revisão | projeto | raiz inicializada e conectada ao repositório oficial | Maycon | colaboração | mitigado |
| RSK-008 | acesso total do administrador amplia impacto de comprometimento ou uso indevido | segurança/privacidade | conta individual, hash forte, espera progressiva e auditoria de ações; revisar antes de dados reais | Maycon/Amanda | G4/G7 | aceito para MVP |
| RSK-009 | recuperação remota ou nuvem pode criar dependência externa e exposição | arquitetura/privacidade | manter fora do MVP; exigir requisito, ameaça, custos e ADR | Maycon/Amanda | ADR futuro | monitorado |
| RSK-010 | misturar Saúde e Educação pode gerar modelo e interface incorretos | produto/arquitetura | separar espaços e executar discovery próprio para Educação | Amanda | novo G1/G2 | mitigado |
| RSK-011 | backup no mesmo disco não protege contra falha física | operação | cópia externa mensal e definição de pen drive/SSD antes do uso real | Amanda | G7 | aberto |
| RSK-012 | retenção clínica indefinida pode violar obrigação legal ou expectativa do titular | legal/privacidade | não eliminar automaticamente no MVP e validar política antes do G7 | Maycon/Amanda | G7 | aberto |
| RSK-013 | base ou fórmula nutricional incorreta pode produzir cardápio inadequado | clínico/produto | Amanda aprova fonte, fórmula, arredondamento e testes antes do incremento | Amanda | G2 clínico | aberto |

Toda aceitação de risco identifica autoridade, data, justificativa e prazo de revisão. Revisar no início e fim de cada gate e após mudança de escopo, arquitetura ou dados.
