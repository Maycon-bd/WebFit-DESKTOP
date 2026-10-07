# Faixa por login e preparação da ativação — DEC-053

2026-10-07. RF-UPD-001 / TA-UPD-UI-002; T112/T113. STRICT para ativação da integração, refinamento de UI dentro da mesma demanda G5. User solicitou desfazer modal, faixa superior, consulta por login e ativação; resposta posterior limita **preparação local, operações de Git pelo usuário**. Nenhum commit/push/merge/release ou configuração remota alterados pelo agente.

Branch feature/pbi-001-primeiro-incremento-saude, HEAD/base fa70d8fa4eac712801c2f3297d29e78a0f130bdb; develop ancestral e upstream local 0/0. Alterações paralelas de harness/comunicação, audit/Impeccable e RF-AUT-004/DEC-052 preservadas. Colisão inicial de IDs detectada e corrigida apenas nesta demanda: DEC-053 e T112/T113; DEC-052/T108–T110 do login lembrado preservados. Candidato 0.1.7 da outra demanda preservado; esta preparação usa 0.1.8.

## Comportamento

Modal, blur e botão/ícone removidos. UpdatePanel agora aparece como faixa no início de workspace-main, somente ao detectar versão nova. Atualizar agora confirma backup/download/assinatura/instalação; Mais tarde oculta nesta sessão. Nova sessão recomeça consulta e estado da faixa; resultado da anterior não é apresentado por remontar com key do token. createLoginUpdateCheck mantém em memória apenas promessa da sessão atual, deduplicando StrictMode, sem limite diário, persistência de token ou log. Offline falha silenciosamente e não bloqueia login/trabalho. Comandos protegidos e bloqueio de operações durante instalação preservados.

## Pipeline

Workflow local habilitado com condição main e push/manual; sem prova de ativação remota. Node 22.18.0 por actions/setup-node, Rust 1.98.1 via rustup 1.29.1 da origem oficial em cache pertencente à conta do runner; checksum conferido antes de executar installer. Inicialização idempotente e isolada do perfil de Maycon. Perl completo usa variável da máquina ou distribuição existente da empresa. Testes usam TMP/TEMP dedicados no runner. Scripts mantêm assinatura, staging vazio, avanço de versão, rascunho, conferência de uploads e validação pública. Runtime/bootstrap completo pela conta NetworkService ainda precisa ser executado após Git; não confundir validação sintática com prova de ambiente.

Origens consultadas: [instalação manual oficial do rustup](https://github.com/rust-lang/rustup/blob/main/doc/user-guide/src/installation/other.md) e [serviço do runner](https://docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/configure-the-application). URLs oficiais do checksum rustup 1.29.1 e manifesto Rust 1.98.1 conferidas por HEAD: HTTP 200. Nenhuma instalação de runtime feita nesta sessão.

GitHub autenticado consultado somente leitura: repositório do código permite push à credencial existente; repositório de releases não permite push à mesma credencial. Isso **não testa WEBFIT_RELEASE_TOKEN**, usado exclusivamente pelo workflow a partir de Secrets. Os três nomes de secrets presentes e WEBFIT_RELEASE_REPO correto confirmados por API; valores secretos não acessados. Consulta de runners por API recebeu HTTP 403; estado remoto/labels não certificados por essa chamada. Serviço local RUNNING comprovado anteriormente. Nenhuma recomendação de copiar/exibir token ou chave.

## Verification

- npm run check PASS: lint, TypeScript, oito testes Node e build.
- npm run format:check PASS; parser PowerShell runner-env.ps1 PASS; YAML do workflow, gatilho main e remoção da guarda false PASS.
- Seis testes Node de release PASS, incluindo staging e assinatura de fixture.
- cargo test --locked PASS: 18 testes, incluindo autorização/backup, restauração e login lembrado da árvore atual, com fixtures/TMP do projeto.
- Clippy PASS; build NSIS 0.1.8 PASS. Avisos existentes de PDB OpenSSL/STATIC_VCRUNTIME e chunk Vite não impediram build.

Uma edição inicial por substituição de texto encontrou o return interno de useEffect e produziu erro de sintaxe; corrigida reconstruindo o componente preservando eventos/instalação. Os checks posteriores passaram. Sem enfraquecimento ou remoção dos testes.

Análise limitada DEC-053: requisito/critério, plano e T112/T113 cobrem faixa, frequência, adiar e preparo local; escopo autorizado confirmado. Backend/script de instalação preservados. Revisão independente solicitada por pergunta; resposta ainda pendente, nenhum agente de revisão acionado sem autorização. Ensaio gráfico Windows e UPD-001–UPD-015 ponta a ponta pendentes; revisão independente e distribuição/licenças antes da primeira publicação continuam a validar. Nenhum Gate concluído por esses checks.

## Próxima ação

Usuário revisa e executa Git, preservando trabalhos paralelos; instruções em docs/operations/own-runner-setup.md. Depois da integração revisada na main, observar Actions, rascunho/publicação/assinatura/latest.json. Instalar candidato com faixa; login com internet deve oferecer versão piloto superior, ensaiar adiar/confirmar/backup/reinício/persistência. O notebook pode ser preparado depois: um runner válido da empresa basta. G5 em execução, somente dados fictícios; G6/G7 pendentes.

Pacote inicial: .artifacts/mvp/2026-10-07/banner-0.1.8/WebFit-Desktop-0.1.8-teste-x64.exe; 219636147 bytes; SHA256 ee7de1328689815181fcbb899999bbf634ed823c37ec37fa98e5013f3d133d06; Authenticode NotSigned. Roteiro, checksum e snapshot das fontes no empacotamento acompanham. Sem assinatura privada de updater local nesta sessão; assinatura real permanece no passo do pipeline com Secrets. Não instalar/publicar automaticamente.
