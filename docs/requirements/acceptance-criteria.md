# Critérios e testes de aceite

## Ativação inicial simplificada — D-LIC-009 / RF-LIC-001

Maycon aprovou implementação e reutilização offline entre computadores em 2026-10-08; dados fictícios/aceite final pendente.

| ID | Cenário e resultado esperado |
|---|---|
| TA-LIC-013 | emissor gera INITIAL assinada/código sem request; sem senha administrativa/chave de emissão no pacote; código abre somente sua licença |
| TA-LIC-014 | destino vazio importa licença/código, prepara profissional/backup e autentica administrador definido no emissor; código/root/assinatura/tipo errados não persistem request/grant/usuários |
| TA-LIC-015 | destino preparado/legado recusa ativação; repetição preserva credenciais/consumo; pacote idêntico ativa outro destino vazio com identidade local distinta (limite aprovado) |
| TA-LIC-016 | quatro operações posteriores/v1 continuam vinculadas; UI cobre erro/carregamento/sucesso/rótulos; NSIS clínico e emissor separados, sem cofre/segredo de emissão distribuído |

## Licenciamento offline — WEBFIT-10

**Status:** cenários aprovados para implementação por Maycon, DEC-058 / ADR-0003 v1 (“Aprovo a implementação”, 2026-10-08). Checks locais em fixtures descritos no registro WEBFIT-10; ensaio visual/instalador Windows e review independente pendentes. Não representam aceite humano da entrega ou garantia contra clonagem offline.

| ID | Requisito | Cenário e resultado esperado |
|---|---|---|
| TA-LIC-001 | RF-LIC-001 | banco vazio aguarda ativação; Setup direto sem autorização válida negado pelo backend |
| TA-LIC-002 | RF-LIC-001 | solicitar/emitir/importar prepara usuários; reabrir offline permite login de Maycon com credencial daquela instalação |
| TA-LIC-003 | RF-LIC-001 | adulteração, versão incompatível ou outro destino rejeitados sem alterar dados/usuários |
| TA-LIC-004 | RF-LIC-001 | repetição não reaplica efeito; interrupção/falha sem preparação parcial; banco preparado não é apagado nem tem credencial trocada por chave inicial |
| TA-LIC-005 | RF-LIC-001/004 | instalador sem segredo de emissão/senha mestra; autorização sem senha recuperável; login errado negado; logs sem segredo/verificador/conteúdo clínico |
| TA-LIC-006 | RF-LIC-002 | destino autorizado recupera backup validado; inválido/cancelado preserva estado; restauração preserva identidade do destino/consumo conforme contrato |
| TA-LIC-007 | RF-LIC-003 | uma sessão até 4 h; logout/bloqueio/limite encerram; autorização consumida não reabre acesso; relógio controlado e limite offline documentado |
| TA-LIC-008 | RF-LIC-004 | recuperação específica troca credencial, antiga deixa de autenticar; dados preservados e senha anterior não revelada; outro tipo não faz reset |
| TA-LIC-009 | RF-LIC-005 | importação não limpa; cancelar/falhar backup preserva; confirmar em fixture limpa consultório, mantém licença/acessos/consumo e tem recuperação exercitada |
| TA-LIC-010 | RF-LIC-001..005 | atualizar/reparar preserva dados/licença/credenciais; testes existentes não apagados automaticamente; nova instalação segue ativação inicial |
| TA-LIC-011 | RF-LIC-001 | aguardo/carregamento/erro/sucesso reais; teclado/rótulos/foco e recuperação sem exibir segredos |
| TA-LIC-012 | RF-LIC-006 | ADIADO para outra demanda: cópia consistente/protegida e retorno sem perder trabalho posterior; fora de WEBFIT-10 |

Cobertura técnica aprovada por D-LIC-006..008 (Maycon, “Aprovo a implementação”); resultados reais e limites no registro WEBFIT-10: TA-LIC-003 verifica root de confiança externo à licença, challenge/tipo/request alterados e limites de arquivos/PHC; TA-LIC-004 consumo transacional em concorrência/interrupção; TA-LIC-005 backup protegido do emissor, chave/credencial não exposta, arquivo/senha errados e release sem root de fixture; TA-LIC-006 staging schema 1/2, destino vazio, consumo/credenciais do destino preservados e usuários históricos inativos; TA-LIC-007 senha temporária própria, consumo no login e deadline absoluto de sessão independente de relógio de parede; TA-LIC-009 inventário de dados clínicos sem apagar perfil/auditoria/licença/backup; TA-LIC-010 legado sem licença somente backup conforme regra decidida. Aprovação técnica específica registrada; aceite humano e ensaio visual Windows continuam separados dos checks locais.


## RF-UX-004 — identidade visual (Maycon, 2026-10-08)

| ID | Critério |
|---|---|
| TA-UX-BRAND-001 | PNG sem texto, quadrado/transparente; ICO multirresolução da mesma identidade |
| TA-UX-BRAND-002 | Executável/janela, atalhos área de trabalho/menu Iniciar e instalador/desinstalador usam símbolo após construção/atualização; cache Windows pode atrasar troca |
| TA-UX-BRAND-003 | Acesso/lateral/Sobre/favicon usam símbolo com proporção e identificação acessível; lateral recolhida oculta sua marca; imagem não recebe foco |
| TA-UX-BRAND-004 | Logo profissional, ações, foco/controles, dados, autorização, versão/identificador e spike preservados; checks existentes passam |

## Refinamento proposto WEBFIT-5

TA-PAT-008..016 / RF-PAT-007: cadastro mínimo, CPF opcional múltiplo, rejeição dos três obrigatórios ausentes, validação dos opcionais informados, sexo por seleção acessível, edição preservando ID, migração/backup anterior e atual, sexo legado e responsável opcional. Cenários em [spec.md](../../specs/003-webfit-5-cadastro-paciente/spec.md). Preparação autorizada por Maycon em 2026-10-07; aprovação funcional/execução e D-PAT-001/002 pendentes. Nenhum critério executado; não substitui ainda TA-PAT-001..007.

**Status:** testes de aceite do primeiro incremento aprovados; resultado será preenchido após execução.

TA-UX-002 (RF-UX-002, aprovado por Maycon em 2026-10-07): abrir informações por clique/teclado no login; conferir nome, versão instalada e crédito exato; fechar por Escape/Fechar e conferir retorno de foco; selecionar Acesso do administrador; em instalação nova preparar admin com senha local e recuperação; em instalação existente autenticar com nome/senha já cadastrados; senha errada continua negada pelo backend; preparação não aparece diretamente para a nutricionista. Ensaio gráfico no Windows pendente.

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
| TA-DRF-005 | RF-DRF-002 | em cada contexto longo aprovado (perfil, cadastro/edição de paciente e prescrição), salvar um rascunho e sair; somente ao abrir o mesmo contexto autenticado aparece a pergunta, sem faixa/lista global na tela de pacientes ou exposição em outro registro | aprovado por Maycon em 2026-10-08 — WEBFIT-7 |
| TA-DRF-006 | RF-DRF-002 | escolher “Restaurar” e verificar que os campos do formulário correspondente recebem os valores do rascunho e continuam editáveis | aprovado por Maycon em 2026-10-08 — WEBFIT-7 |
| TA-DRF-007 | RF-DRF-002/RN-DRF-007 | escolher “Descartar” para cadastro novo; somente o autosave correspondente é removido e os campos ficam vazios para novo registro | aprovado por Maycon em 2026-10-08 — WEBFIT-7 |
| TA-DRF-008 | RF-DRF-002/RN-DRF-007 | escolher “Descartar” ao editar; somente o autosave correspondente é removido, os dados persistidos são reapresentados e alterações não confirmadas não substituem o registro | aprovado por Maycon em 2026-10-08 — WEBFIT-7 (preserva RF-PAT-003/TA-PAT-004) |
| TA-DRF-009 | RF-DRF-002/RN-DRF-002 | simular falha ao carregar ou descartar e verificar mensagem de erro, ausência de falso sucesso e preservação da última versão válida e dos dados persistidos | aprovado por Maycon em 2026-10-08 — WEBFIT-7 |
| TA-DRF-010 | RF-DRF-002 | modal operável por teclado e tecnologia assistiva; nomes “Sim, restaurar”/“Não, descartar”/“Voltar à lista” ou “Voltar ao paciente”; foco permanece no modal até ação explícita; Escape equivale a Voltar preservando rascunho/registro, clique externo inerte; foco retorna ao formulário após restaurar/descartar e ao título do destino após Voltar; reentrada oferece novamente; operação em andamento bloqueia saída | aprovado por Maycon em 2026-10-08 — WEBFIT-7, refinado em WEBFIT-13 / D-DRF-EXIT-001 |
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
| TA-AUD-014 | RF-AUD-001 | Given evento de usuário autenticado, rotina automática e tentativa pré-autenticação, When consultar lista e detalhe, Then apresentar respectivamente o rótulo autorizado do usuário, Sistema e Não autenticado; somente o primeiro possuir referência de usuário e responder ao filtro de usuário, e nenhum evento pré-autenticação expor identificador ou credencial fornecida | aprovado por Amanda e Maycon em 2026-09-17 — D-AUTO-001 |
| TA-AUD-015 | RF-AUD-001 | Given consulta iniciada em T = query_as_of_utc e eventos nas fronteiras, com instantes iguais e com novos eventos após T, When abrir e percorrer páginas, Then incluir eventos com instante maior ou igual a T − 30 × 24 h e menor que T, ordenar por instante e ID decrescentes, manter filtros/snapshot no cursor, limitar cada página a 50 e não duplicar, perder ou inserir eventos posteriores a T | aprovado por Amanda e Maycon em 2026-09-17 — D-AUTO-002 |
| TA-BKP-001 | RF-BKP-001 | criar backup manual com banco, arquivos, manifesto e checksums válidos | aprovado |
| TA-BKP-002 | RF-BKP-001 | simular primeiro uso diário e confirmar um backup automático sem duplicação indevida | aprovado |
| TA-BKP-003 | RF-BKP-002 | restaurar pacote válido em teste e comparar integridade e contagens | aprovado |
| TA-BKP-004 | RF-BKP-002 | rejeitar pacote corrompido/incompatível e preservar o estado atual | aprovado |
| TA-BKP-005 | RF-BKP-003 | exibir sucesso recente, falha imediata e alerta após mais de 24 h sem backup válido | aprovado |

Dados de teste são totalmente fictícios. Evidência, executor, data e resultado serão preenchidos na execução.
# Preparação retomada do updater — 2026-10-07

RF-UPD-001 aprovado por DEC-043/ADR-0002, execução local DEC-050. Critérios UPD-001–UPD-015 continuam em docs/quality/update-spike-test-plan.md; testes locais e pendências em .harness/evidence/update-pilot/2026-10-07-product-preparation.md. Não atribuir aceite de atualização Windows aos testes unitários ou de backup isolado. G5/G6/G7 permanecem abertos.
TA-UPD-UI-001 / RF-UPD-001 / DEC-051, aprovado por Maycon em 2026-10-07: abrir Atualizações em modal central, fundo desfocado e inativo; Tab permanece no modal; Escape/Continuar trabalhando fecham e devolvem foco; consulta/progresso/mensagens no modal; fechar indisponível durante instalação. Falha de consulta não impede uso após fechar. Aceite gráfico Windows pendente.

TA-AUT-005 / RF-AUT-004 (aprovado por Maycon, 2026-10-07): login válido marcado -> reiniciar -> nome preenchido e senha vazia; login válido desmarcado -> reiniciar -> sem nome lembrado; login inválido -> preferência anterior preservada; acesso não autenticado não pode gravar preferências; admin e nutricionista não sobrescrevem a preferência do outro; logout/bloqueio continuam exigindo senha. Falha de leitura/gravação da preferência recebe mensagem sem impedir login válido.
TA-UPD-UI-002 / RF-UPD-001 / DEC-053, aprovado 2026-10-07: nova consulta a cada login, uma requisição por sessão mesmo sob StrictMode, sem cache diário. Só exibir faixa superior se nova versão; Atualizar agora confirma, Mais tarde oculta nesta sessão. Sem modal/ícone; offline não bloqueia login/trabalho. Backup/assinatura/bloqueio preservados; ensaio integrado de publicação/instalação ainda obrigatório. Supersede TA-UPD-UI-001 para apresentação.


## Navegação — WEBFIT-4

RF-UX-003: comportamento definido por Maycon em 2026-10-07, execução/validação pendentes. Cenários derivam da solicitação e das invariantes aprovadas; detalhes provisórios do plan aguardam gate em lote.

| ID | Cenário e resultado esperado | FR |
|---|---|---|
| TA-UX-NAV-001 | Fechar/reabrir por hambúrguer: só botão permanece da lateral; conteúdo ocupa espaço; mesma tela/campos sem remount ou navegação | FR-001 |
| TA-UX-NAV-002 | Menu exibe somente Consultório e Pacientes; sem Educação/futuros ou duplicação de conta/ferramentas | FR-002 |
| TA-UX-NAV-003 | Engrenagem junto ao nome abre Configurações com Auditoria e Backup e restauração | FR-003 |
| TA-UX-NAV-004 | Índice não consulta/audita Auditoria nem executa backup; seleção abre ferramenta existente e retorno funciona; filtros, confirmações e encerramento de sessão na restauração preservados | FR-004/006 |
| TA-UX-NAV-005 | Nome abre Acesso/Perfil sem navegar; seleção usa navegação segura; Escape fecha opções | FR-005 |
| TA-UX-NAV-006 | Salvar rascunho antes de destino; falha mantém dados/página e mostra erro; busy, must_change, logout e backend preservados | FR-006 |
| TA-UX-NAV-007 | Todos novos controles por teclado/nome acessível/foco/estado; zero controles laterais focáveis quando oculta; zoom 200%, nome longo/janela reduzida | FR-008 |
| TA-UX-NAV-008 | Tours pacientes/acesso não apontam a controles ocultos/errados, Pular/Ver tutorial funcionam; faixa/consulta por sessão e bloqueios de instalação não reiniciam ao recolher | FR-007 |

## WEBFIT-9 — faixa compacta e consulta durante uso

| ID | Critério de aceite |
|---|---|
| TA-UPD-UI-003 | Nova versão publicada após login detectada na próxima consulta de 30 minutos ou retorno permitido; StrictMode/eventos simultâneos não duplicam request; cooldown de retorno um minuto |
| TA-UPD-UI-004 | Offline não bloqueia trabalho; retry na mesma sessão; cleanup remove timers/listeners e resposta antiga não altera nova sessão; pausa durante instalação |
| TA-UPD-UI-005 | Faixa global acima de lateral/conteúdo, texto de salvar antes de atualizar/reiniciar, Atualizar à direita, detalhes recolhidos, aproximadamente 48–56px em janela larga, quebra acessível em estreita/zoom 200% |
| TA-UPD-UI-006 | Campos/foco/página preservados; instalação bloqueada durante edição/operação; adiamento da mesma versão por sessão, nova versão/login pode avisar; backup/assinatura/progresso/erro preservados |

Aprovação de implementação: Maycon em 2026-10-08; D-UPD9-001 provisória, aceite final/Windows integrado pendentes.
