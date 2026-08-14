# Registro de riscos

Escalas de probabilidade e impacto ainda serão definidas. Até lá, não atribuir pontuações arbitrárias.

## Template

| Campo | Preenchimento |
|---|---|
| ID | `RSK-NNN` |
| Risco | evento incerto em formato causa → evento → impacto |
| Categoria | produto, técnico, segurança, privacidade, operação, legal ou projeto |
| Probabilidade/impacto | valor segundo escala aprovada; `a avaliar` enquanto inexistente |
| Sinais | indicadores observáveis |
| Resposta | evitar, mitigar, transferir ou aceitar, com ações |
| Dono | pessoa responsável por acompanhar |
| Prazo/gate | momento de decisão ou revisão |
| Estado | aberto, monitorado, mitigado, aceito ou encerrado |
| Evidência | links e resultados verificáveis |

## Riscos iniciais

| ID | Risco | Categoria | Probabilidade | Impacto | Resposta/ação inicial | Dono | Gate | Estado |
|---|---|---|---|---|---|---|---|---|
| RSK-001 | se as hipóteses de usuário e escopo não forem validadas, o MVP pode resolver o problema errado ou crescer sem limite | produto | a avaliar | a avaliar | concluir decisões do G1 antes da baseline e da implementação | a definir | G1 | aberto |
| RSK-002 | se Tauri, SQLite, criptografia ou empacotamento não satisfizerem as restrições, a fundação pode exigir retrabalho | técnico/segurança | a avaliar | a avaliar | executar spike mensurável do ADR-0001 antes de portar módulos | a definir | G4 | aberto |
| RSK-003 | se banco, arquivos e chaves não tiverem proteção coerente, dados de saúde podem ser expostos no computador ou em backups | segurança/privacidade | a avaliar | a avaliar | definir modelo de ameaças, estratégia de chaves e testes antes de dados reais | a definir | G4/G7 | aberto |
| RSK-004 | se backup não for recente, íntegro e restaurável, falha de disco ou erro do operador pode causar perda de dados | operação | a avaliar | a avaliar | definir RPO/RTO e provar restauração completa em instalação limpa | a definir | G4/G6/G7 | aberto |
| RSK-005 | se decisões legadas conflitantes forem importadas como fatos, regras incorretas podem ser implementadas | produto/projeto | a avaliar | a avaliar | curar fontes, preservar origem e resolver conflitos antes do G2 | a definir | G2 | aberto |
| RSK-006 | se surgir necessidade de dois computadores, acesso remoto ou sincronização, SQLite local deixará de atender a premissa central | arquitetura/produto | a avaliar | a avaliar | monitorar gatilhos e reabrir o ADR antes de expandir o escopo | a definir | revisão contínua | aberto |
| RSK-007 | se o diretório efetivo não for inicializado como repositório Git, mudanças podem ficar sem histórico e revisão confiáveis | projeto | a avaliar | a avaliar | confirmar a raiz definitiva e inicializar Git por decisão explícita do responsável | a definir | antes da colaboração/versionamento | aberto |

## Cadência

Revisar no início e no fim de cada gate, após mudanças de escopo/arquitetura/dados e quando um sinal ocorrer. Toda aceitação de risco deve identificar autoridade, data, justificativa e prazo de revisão.
