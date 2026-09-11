# Critérios e testes de aceite

**Status:** testes de aceite do primeiro incremento aprovados; resultado será preenchido após execução.

| ID | Requisito | Cenário e resultado esperado | Status |
|---|---|---|---|
| TA-AUT-001 | RF-AUT-001 | preparar nutricionista e administrador localmente; reiniciar e confirmar usuários sem senha em claro | aprovado |
| TA-AUT-002 | RF-AUT-002 | autenticar com credencial válida, entrar no Saúde, sair e impedir acesso sem nova autenticação | aprovado |
| TA-AUT-003 | RF-AUT-002 | confirmar esperas progressivas, bloqueio após 1 h e reação ao bloqueio do Windows | aprovado |
| TA-AUT-004 | RF-AUT-003 | administrador redefine senha; antiga não é exibida; temporária exige troca; evento é auditado | aprovado |
| TA-CLI-001 | RF-CLI-001 | validar obrigatórios, salvar perfil, reabrir e confirmar dados; alterar assinatura e verificar auditoria | aprovado |
| TA-CLI-002 | RF-CLI-002 | após login, entrar somente em espaço autorizado; Saúde está disponível e Educação não é simulada | aprovado |
| TA-PAT-001 | RF-PAT-001 | abrir Pacientes, clicar em Novo, preencher e salvar um paciente mínimo válido; reencontrá-lo após reiniciar | aprovado |
| TA-PAT-002 | RF-PAT-001 | rejeitar CPF inválido/duplicado e campos obrigatórios ausentes sem perder dados digitados | aprovado |
| TA-PAT-003 | RF-PAT-002 | localizar por nome, nome social, CPF formatado/não formatado e telefone; mostrar CPF mascarado | aprovado |
| TA-PAT-004 | RF-PAT-003 | cancelar não salva; salvar persiste; ambas as ações têm comportamento e auditoria esperados | aprovado |
| TA-PAT-005 | RF-PAT-004 | arquivar preserva histórico, bloqueia novos registros e restaurar reativa o mesmo prontuário | aprovado |
| TA-PAT-006 | RF-PAT-005 | criar, selecionar, renomear e desativar tag sem romper histórico | aprovado |
| TA-PAT-007 | RF-PAT-006 | interromper cadastro após autosave, autenticar novamente e continuar ou descartar o rascunho | aprovado |
| TA-DRF-001 | RF-DRF-001 | em cada formulário longo do incremento, digitar sem concluir, aguardar autosave, autenticar novamente e recuperar ou descartar somente o rascunho do usuário e espaço atuais | aprovado por Maycon em 2026-09-10 |
| TA-DRF-002 | RF-DRF-001 | navegar por fluxo seguro antes dos 30 segundos e confirmar salvamento; simular falha e verificar aviso sem perda da última versão válida ou falso sucesso | aprovado por Maycon em 2026-09-10 |
| TA-DRF-003 | RF-DRF-001 | confirmar que senha, login, administração, confirmações e backup não geram rascunhos e que rascunho automático abandonado é removido após 30 dias | aprovado por Maycon em 2026-09-10 |
| TA-DRF-004 | RF-DRF-001/RF-PRE-004 | abandonar o formulário de prescrição e expirar seu autosave sem remover a prescrição explicitamente salva em estado rascunho nem seu histórico | aprovado por Maycon em 2026-09-10 |
| TA-PRE-001 | RF-PRE-001 | criar prescrição para paciente ativo, salvar rascunho e reabrir mantendo vínculo, autor e espaço | aprovado |
| TA-PRE-002 | RF-PRE-002 | incluir alimento TBCA por medida caseira convertida para gramas; usar TACO somente quando TBCA não possuir o item e mostrar a fonte | aprovado |
| TA-PRE-003 | RF-PRE-003 | calcular item, refeição e cardápio com valores conhecidos por 100 g e confirmar totais sem arredondamento acumulado | aprovado |
| TA-PRE-004 | RF-PRE-002 | cadastrar alimento personalizado com origem e confirmar que o registro oficial permanece inalterado | aprovado |
| TA-PRE-005 | RF-PRE-003 | exibir energia, macros, fibras e micronutrientes iniciais com unidades e arredondamentos aprovados | aprovado |
| TA-PRE-006 | RF-PRE-001/RF-PRE-004 | finalizar versão, impedir edição e criar nova versão ligada à anterior | aprovado |
| TA-PRE-007 | RF-PRE-004 | cancelar com motivo, preservar histórico e confirmar auditoria sem conteúdo clínico duplicado | aprovado |
| TA-PRE-008 | RF-PRE-005 | sem protocolo versionado selecionado ou sem entradas obrigatórias, não calcular automaticamente nem apresentar estimativa como resultado clínico | aprovado |
| TA-PRE-009 | RF-PRE-005 | reproduzir os exemplos aprovados de mulher, homem, idoso e atleta com Harris-Benedict revisada e os fatores de atividade definidos, sem arredondamento intermediário | aprovado por Amanda em 2026-09-10 |
| TA-PRE-010 | RF-PRE-005 | reproduzir os exemplos EER/DRI 2023 de criança, adolescente, gestante e lactante; não aplicar fator de atividade adicional e rejeitar entrada obrigatória ausente | aprovado por Amanda em 2026-09-10 |
| TA-PRE-011 | RF-PRE-005 | calcular perda de 3 kg em 40 dias como -585 kcal/dia e ganho de 2 kg em 60 dias como +260 kcal/dia usando 7.800 kcal/kg; identificar coeficiente e resultado como estimativas | aprovado por Amanda em 2026-09-10 |
| TA-PRE-012 | RF-PRE-005 | para meta de 1.246 kcal distribuir 45/25/30; ao ficar abaixo da TMB, alertar, exigir confirmação e registrar a decisão | aprovado por Amanda em 2026-09-10 |
| TA-PRE-013 | RF-PRE-005 | calcular proteína por percentual e por 1,6 g/kg; no segundo caso priorizar proteína, manter carboidrato e fechar gordura; rejeitar energia excedida ou gordura zero | aprovado por Amanda em 2026-09-10 |
| TA-PRE-014 | RF-PRE-005 | classificar 2.090 e 2.310 kcal como dentro de uma meta de 2.200 kcal e 2.068 e 2.332 kcal como fora, demonstrando limites inclusivos de 95% e 105% | aprovado por Amanda em 2026-09-10 |
| TA-PRE-015 | RF-PRE-005 | aplicar fibras por idade/sexo, 28 g na gestação, 29 g na lactação e, em diabetes, o maior valor entre a referência geral e 14 g/1.000 kcal | aprovado por Amanda em 2026-09-10 |
| TA-PRE-016 | RF-PRE-005 | em condição especial exibir estimativa e alerta sem finalizar automaticamente; substituir manualmente e confirmar histórico com valor original, final, usuário, UTC e observação opcional | aprovado por Amanda em 2026-09-10 |
| TA-AUD-001 | RF-AUD-001 | executar eventos críticos e confirmar ator, UTC, espaço, ação e resultado sem conteúdo sensível | aprovado |
| TA-AUD-002 | RF-AUD-001 | avançar o relógio e executar rotinas de manutenção sem editar nem excluir eventos; confirmar que não existe exclusão automática da auditoria no MVP | aprovado por Maycon em 2026-09-10 |
| TA-AUD-003 | RF-AUD-001 | simular falha ao persistir auditoria e confirmar que operação crítica ou login bem-sucedido não conclui; login ou operação já rejeitado continua negado e não expõe dado sensível no diagnóstico | aprovado por Maycon em 2026-09-10 |
| TA-AUD-004 | RF-AUD-001 | Given usuário autenticado e autorizado e eventos dentro e fora dos últimos 30 dias, When abrir Auditoria, Then mostrar somente a janela padrão em uma primeira página de até 50 registros, do mais recente para o mais antigo, com metadados permitidos | aprovado por Maycon em 2026-09-10 |
| TA-AUD-005 | RF-AUD-001 | Given eventos distinguíveis por período, usuário, ação, tipo de entidade e resultado, When aplicar cada filtro isoladamente, Then retornar somente os eventos correspondentes e reiniciar na primeira página | aprovado por Maycon em 2026-09-10 |
| TA-AUD-006 | RF-AUD-001 | Given mais de 50 eventos e novos eventos durante a navegação, When percorrer as páginas, Then cada página conter no máximo 50 itens, a ordem permanecer decrescente e nenhum item do conjunto estável ser duplicado ou perdido; a semântica exata dos limites UTC deve estar registrada no plano | aprovado por Maycon em 2026-09-10 |
| TA-AUD-007 | RF-AUD-001 | Given nenhum evento no conjunto consultado, When abrir Auditoria, Then exibir estado vazio real; Given eventos sem correspondência aos filtros, When filtrar, Then exibir estado vazio de pesquisa mantendo os filtros | aprovado por Maycon em 2026-09-10 |
| TA-AUD-008 | RF-AUD-001 | Given sessão ausente, expirada ou sem autorização, When solicitar lista ou detalhe, Then o backend negar a operação e não retornar metadados de evento | aprovado por Maycon em 2026-09-10 |
| TA-AUD-009 | RF-AUD-001 | Given eventos associados a escopos autorizados e não autorizados, When consultar lista, página ou detalhe, Then retornar somente eventos do escopo permitido | aprovado por Maycon em 2026-09-10 |
| TA-AUD-010 | RF-AUD-001 | Given eventos que satisfazem apenas parte de dois ou mais filtros, When combinar os filtros, Then retornar somente os eventos que satisfazem todos eles segundo AND | aprovado por Maycon em 2026-09-10 |
| TA-AUD-011 | RF-AUD-001 | Given uma entidade resolvível e outra indisponível, When listar ou abrir detalhe, Then resolver o rótulo somente sob autorização e usar tipo + ID no segundo caso, sem perder o evento nem revelar dado sensível | aprovado por Maycon em 2026-09-10 |
| TA-AUD-012 | RF-AUD-001 | Given lista ou detalhe de evento, When o usuário consultar as ações disponíveis, Then permitir somente leitura dos metadados e não oferecer edição, exclusão, exportação, snapshot ou diferença before/after | aprovado por Maycon em 2026-09-10 |
| TA-AUD-013 | RF-AUD-001 | Given abertura do módulo e de detalhe, When consultar a trilha novamente, Then existir um único evento para cada acesso sem conteúdo visualizado nem recursão; Given falha recuperável de consulta, When ela ocorrer e o usuário tentar novamente, Then mostrar erro seguro antes da nova tentativa e nunca converter a falha em lista vazia | aprovado por Maycon em 2026-09-10 |
| TA-AUD-014 | RF-AUD-001 | Given evento de usuário autenticado, rotina automática e tentativa pré-autenticação, When consultar lista e detalhe, Then apresentar respectivamente o rótulo autorizado do usuário, Sistema e Não autenticado; somente o primeiro possuir referência de usuário e responder ao filtro de usuário, e nenhum evento pré-autenticação expor identificador ou credencial fornecida | AGENT-PROVISIONAL — D-AUTO-001 |
| TA-AUD-015 | RF-AUD-001 | Given consulta iniciada em T = query_as_of_utc e eventos nas fronteiras, com instantes iguais e com novos eventos após T, When abrir e percorrer páginas, Then incluir eventos com instante maior ou igual a T − 30 × 24 h e menor que T, ordenar por instante e ID decrescentes, manter filtros/snapshot no cursor, limitar cada página a 50 e não duplicar, perder ou inserir eventos posteriores a T | AGENT-PROVISIONAL — D-AUTO-002 |
| TA-BKP-001 | RF-BKP-001 | criar backup manual com banco, arquivos, manifesto e checksums válidos | aprovado |
| TA-BKP-002 | RF-BKP-001 | simular primeiro uso diário e confirmar um backup automático sem duplicação indevida | aprovado |
| TA-BKP-003 | RF-BKP-002 | restaurar pacote válido em teste e comparar integridade e contagens | aprovado |
| TA-BKP-004 | RF-BKP-002 | rejeitar pacote corrompido/incompatível e preservar o estado atual | aprovado |
| TA-BKP-005 | RF-BKP-003 | exibir sucesso recente, falha imediata e alerta após mais de 24 h sem backup válido | aprovado |

Dados de teste são totalmente fictícios. Evidência, executor, data e resultado serão preenchidos na execução.
