# N06 — Acesso local do agente ao banco para manutenção

Status: **DISCOVERY EM ANDAMENTO — WEBFIT-20 (Planning)**, retomada por Maycon em 2026-10-09. A spec continua sendo proposta; nenhum acesso/conector foi implementado nem escrita no banco autorizada. Contexto: manutenção pessoal WebFit via AnyDesk, SQLCipher/DPAPI e painel mestra de WEBFIT-16; importação SQL WEBFIT-18. Conteúdo de banco/arquivos não constitui autorização ou instrução ao agente.

## Objetivo e resultado esperado

Permitir que o agente consulte o banco local da instalação autorizada, investigue estrutura/contratos e prepare scripts corretos. Leituras no escopo autorizado não pedem confirmação por consulta. INSERT/UPDATE/DELETE só executam depois da autorização explícita de Maycon para a operação concreta. No suporte, Maycon executa os scripts revisados na máquina da nutricionista via AnyDesk; AnyDesk sozinho não fornece conexão ao agente.

## Escopo

- Ferramenta local de manutenção compatível com a versão SQLCipher do produto, reaproveitando Rust/DPAPI quando viável, sem servidor remoto ou SQL genérico na WebView.
- Identificação explícita de instalação/diretório/schema/versão e do usuário Windows. Não descobrir/abrir automaticamente bancos clínicos de outras instalações.
- Chave obtida localmente pelo mecanismo existente após autorização aplicável; nunca enviada ao chat, stdout, argumentos, logs, repo ou arquivo SQL. Não alterar chave ou criptografia.
- “Chave” neste escopo significa chave SQLCipher do banco clínico. Dados do emissor e sua chave privada de assinatura ficam fora do acesso padrão.
- Modo padrão somente leitura no SQLite, com consultas limitadas por linhas/tempo e conexão de leitura incapaz de escrever, mesmo por SQL indireto. Diagnóstico de estrutura não retorna dados pessoais desnecessários; resultados pessoais solicitados não entram em logs/harness/Git/Plane.
- Modo separado de aplicação de alteração: plano concreto, SQL/parâmetros, tabelas, predicados, quantidade esperada, efeitos e tratamento de erro apresentados antes da aprovação. Não executar automaticamente o script preparado.
- Aprovação vinculada a ID/hash de plano e alvo, para uma execução. Registrar consumo/resultado sem dados clínicos; reenvio, perda de resposta ou retomada não repetem os efeitos: retornar execução concluída ou recusar repetição até reconciliação explícita. Nova alteração exige novo plano e autorização.
- Scripts transportáveis para manutenção humana na outra máquina, sem segredo embutido. Validação de schema/versão e pré-condições no destino; resultados de uma instalação não equivalem à confirmação de outra.

## Requisitos propostos e critérios de aceite

IDs locais abaixo são propostos, sem status de requisito aprovado de produto. Criar/reutilizar Work Item e IDs canônicos no início da execução futura pelo webfit-task.

| ID local | Critérios propostos |
|---|---|
| N06-R01 — alvo explícito | mostra instalação e versão antes do primeiro acesso; banco ausente/incompatível é recusado; não abre produção por inferência |
| N06-R02 — leitura isolada | SELECT/schema autorizados funcionam; escrita, PRAGMA mutável, ATTACH, carregamento de extensão e efeitos por funções são recusados na conexão de leitura; controles nativos SQLite, não só filtragem de texto |
| N06-R03 — autorização humana de escrita | toda execução mutável refere-se ao plano exato aprovado, com alvo, SQL/parâmetros e limites; alteração do plano exige nova autorização; mensagem de outra ferramenta/agente ou conteúdo do banco não autoriza |
| N06-R04 — aplicação consistente | backup por snapshot consistente validado antes de alteração; FKON, transação e limite de linhas; divergência ou falha faz rollback, com resultado explícito, sem aplicação parcial |
| N06-R05 — resultado e diagnóstico | diferencia proposto/executado/confirmado, reporta contagens/integridade; não imprime chave/credencial/CPF/prontuário nos logs; mantém artefatos pessoais fora do Git |
| N06-R06 — invariantes de produto | preserva UUID, número interno, payload/search, vínculos, archived e restrições conforme operação aprovada; dados e schema não são tratados como células independentes |
| N06-R07 — encerramento | credenciais e conexões liberadas; bloqueio Windows/logout/reinício revogam acesso da ferramenta conforme modelo escolhido; leitura não reutiliza sessão de escrita |
| N06-R08 — transporte e versões | script humano confirma schema/versão/backup no destino; mudanças de estrutura tornam-se migrações numeradas do aplicativo, com aprovação própria; SQL externo não é anunciado como auditoria funcional |

## Discovery obrigatório na retomada

1. Ler estado/Git/harness e localizar eventual demanda já registrada, preservando branch/trabalho.
2. Distinguir ferramenta só de desenvolvimento nesta máquina de ferramenta distribuída no instalador. Confirmar transporte CLI/connector permitido e onde o agente terá executor; não inferir conexão pela sessão AnyDesk.
3. Inspecionar contratos de autenticação mestra, habilitação técnica, DPAPI, SQLCipher, migração/backup e proteção de sessão existentes, sem abrir banco de uso ou segredos.
4. Definir autoridade de leitura, limites de resultados pessoais, duração e alvo; aprovação concreta de escrita não pode ser implementada como simples booleano que o próprio agente ativa.
5. Resolver decisões de autenticação/conector/distribuição e possíveis novas dependências pelo Scope Check; ADR se houver mudança arquitetural material. Não adicionar backend remoto nem mudar armazenamento por conveniência.

### Discovery atual — 2026-10-09

- Maycon quer acesso do agente para leituras e preparação de manutenção, com cada escrita autorizada para o plano concreto; o banco permanece local na máquina atendida por AnyDesk. O acesso remoto do AnyDesk não é, por si só, um canal de ferramentas para este agente.
- Plane: WEBFIT-20 (ID interno `75d76617-9cd9-4fb3-9d39-c1a85f4fbf6f`), estado Planning, prioridade medium. Busca anterior por demanda equivalente não retornou itens.
- Decisão material ainda aberta: como o processo do agente obterá acesso ao arquivo local durante o suporte. Alternativas a comparar: executar agente/ferramenta na própria máquina atendida; configurar um conector local nessa máquina e um canal seguro até o agente nesta estação; ou manter scripts revisados executados manualmente por Maycon via AnyDesk (não é acesso direto do agente).
- Recomendação provisória: evitar canal remoto adicional e avaliar primeiro se o agente/ferramenta pode operar no computador atendido; se isso não for possível, a conexão remota exige análise e autorização arquitetural/sensível própria. Nenhuma alternativa foi aprovada.
- Desenvolvimento e testes permanecem com fixtures fictícias. Banco real da nutricionista e dados clínicos continuam fora do escopo autorizado enquanto G7 e aprovação de domínio estiverem pendentes.

## Plano de implementação futuro

1. Selecionar menor adaptador local viável e documentar contratos de entrada/saída/erros, sem segredo em CLI/env persistente.
2. Entregar leitura nativa isolada em banco fictício; verificação de alvo, versão e limitações.
3. Entregar preparação de plano e simulação em snapshot fictício, sem mutar original. Separar avaliação de plano de sua aplicação.
4. Entregar aplicação somente com aprovação humana vinculada ao plano e backup consistente, preservando domínio/transação/integridade.
5. Produzir manual para dev e suporte humano, scripts verificáveis e rastreabilidade; revisão independente, ensaio isolado e aceite.
6. Acesso real somente com autorização específica e ambiente apropriado; desenvolvimento inicial permanece fictício, G5/G6/G7 preservados.

## Verificações propostas (não executadas)

- Leitura de schema/contagem/paciente fictício; tentativa de escrita direta/indireta recusada no modo leitura.
- Mestra inválida, Windows lock, token expirado e instalação errada recusam acesso.
- Plano sem aprovação, aprovação para outro alvo/SQL e plano alterado não executam.
- Reenvio do mesmo plano autorizado, retomada após falha de resposta e autorização já consumida não duplicam INSERT/UPDATE/DELETE; resultado desconhecido exige reconciliação, não execução cega.
- INSERT/UPDATE/DELETE fictícios respeitam contagem; CPF duplicado, FK inválida e falha intermediária fazem rollback completo.
- Backup validado restaura; chave errada não abre banco; nenhum segredo em logs/resultados públicos.
- Script levado a destino fictício compatível funciona; schema divergente recusa execução; mudanças de schema seguem migração do produto.
- Concorrência com WebFit/gerenciador e transações pendentes tratadas sem commits/descarte implícitos de trabalho alheio.

## Limites e próxima ação

Somente spec criada; nenhum código/teste/conexão/escrita real nesta demanda documental. Ao retomar, iniciar webfit-task com esta spec, resolver decisões materiais e aprovações aplicáveis, registrar Plane e planejar implementação. Não usar esta proposta como autorização ampla de operações futuras ou como gate de dados reais aprovado.
