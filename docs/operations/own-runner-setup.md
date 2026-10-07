# Runners Windows próprios — piloto

Preparação local autorizada pelas DEC-050/DEC-053. Workflow habilitado no arquivo local para main; Maycon escolheu executar as operações de Git. Remoto só ficará ativo após integração e execução confirmadas; atualização manual permanece vigente até T082/T083 passarem.

## Como os dois computadores trabalham

O computador da empresa já foi registrado como `DESKTOP-GEUP094`. O notebook precisa de outro registro no mesmo repositório `Maycon-bd/WebFit-DESKTOP`, com nome próprio e labels padrão `self-hosted`, `windows`, `x64`. Um job é executado por um runner disponível que corresponda a essas labels. **A máquina que enviou o código não determina o runner escolhido.** Se ambos estiverem desligados, o job fica na fila enquanto for válido; ao ligar um runner disponível ele pode receber o trabalho. Não é necessário manter ambos ligados 24 horas.

O GitHub recebe o código e agenda o job; o runner baixa o commit exato, testa, compila e envia os artefatos para `Maycon-bd/webfit-desktop-releases`. O aplicativo consulta o `latest.json` público nesse repositório. Depois de publicado, qualquer um dos computadores de desenvolvimento pode desligar: os downloads vêm do GitHub.

## Preparar cada máquina

1. Instalar Git, Node compatível com o projeto (Node 22.18 ou superior), Rust MSVC com `rustfmt`/`clippy`, Visual Studio Build Tools para C++/SDK Windows e Strawberry Perl completo. São ferramentas de build; não são necessárias no computador de Amanda.
2. Em GitHub → repositório do código → Settings → Actions → Runners → New self-hosted runner, selecionar Windows x64. Executar **na máquina a registrar** os comandos apresentados pelo GitHub. O token temporário fica apenas nesse procedimento; não salvar no projeto ou neste chat. Escolher serviço e conta com acesso às ferramentas.
3. Ferramentas instaladas apenas no perfil de Maycon podem não estar disponíveis para `NetworkService`. O teste no terminal de Maycon não certifica o serviço. Verificar PATH, Rust/Cargo home e permissões de leitura/execução **da conta do serviço**, além da escrita na pasta do runner.
4. O checkout do runner é independente deste projeto. A pasta ignorada `.tools/strawberry` **não acompanha Git**. Para reutilizar uma distribuição completa de Perl existente fora do checkout, disponibilizar à conta do serviço a variável `WEBFIT_PERL_PATH` apontando à raiz Strawberry que contém `perl/bin/perl.exe` e `c/bin`. Na empresa, a distribuição local atual está em `D:\MAYCON\PROJETOS\WebFit-DESKTOP\.tools\strawberry`; confirmar acesso antes de usá-la. Reiniciar o serviço depois de mudanças no ambiente, fora de execução de jobs.
5. O workflow faz a verificação básica no início do job por `scripts/runner-env.mjs`. Não é preciso iniciar manualmente arquivos PowerShell; a política da conta de serviço pode bloqueá-los. **Somente um build pelo serviço comprova MSVC, Perl e SQLCipher**.

Não copiar chave privada entre os computadores. O workflow recebe `TAURI_SIGNING_PRIVATE_KEY`, `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` e `WEBFIT_RELEASE_TOKEN` dos GitHub Secrets existentes; a variável `WEBFIT_RELEASE_REPO` deve continuar `webfit-desktop-releases`. Os valores não devem aparecer em logs.

## Ativação e primeiro ensaio

O job local usa `github.ref == 'refs/heads/main'` após solicitação explícita DEC-053. Antes de integrar: revisão independente, acesso de publicação do token e distribuição dos componentes revisados. O usuário faz commit/envio/integração; nenhum Git remoto ou release foi modificado pelo agente. Integrar por revisão, mantendo a proteção da branch.

O workflow usa `cmd` para executar as etapas, evitando a política PowerShell que bloqueia até os scripts temporários criados pelo runner. `runner-env.mjs` prepara Node 22.18.0/Rust 1.98.1 em cache do runner, verifica o checksum do rustup 1.29.1 da origem oficial, valida Perl completo e exporta ferramentas e TMP/TEMP dedicados. Para os downloads do Rust, usa o backend padrão com `RUSTUP_USE_CURL=0`, inclusive nas etapas seguintes, e tenta no máximo três vezes em falhas transitórias de transporte, com pausas de 2s e 4s. Checksum, certificado, permissão e erros permanentes interrompem sem retry. Cada tentativa de baixar o instalador/checksum tem limite de 120s; o download de componentes continua sujeito aos limites do próprio Rustup. O bootstrap instala Rustup sem toolchain padrão e instala Rust 1.98.1 com rustfmt/clippy separadamente, sob a mesma política de retry. Os testes de preparação são executados antes do bootstrap. Isso evita depender do Rust instalado no perfil de Maycon e não altera a política do Windows. O primeiro build real pela conta do serviço ainda comprovará MSVC, Perl e SQLCipher. Na empresa, usa a distribuição local Strawberry existente. No notebook, definir WEBFIT_PERL_PATH correspondente antes de habilitar seu serviço. Um runner válido basta; preparar o notebook não bloqueia publicar usando o da empresa.

## Integração pelo usuário

1. Revisar produto, pipeline e evidências antes de registrar o commit. O checkout também contém alterações paralelas do harness/comunicação; preservar e separar essas mudanças conscientemente. Não usar git add . para incluir tudo sem revisão.
2. Registrar/enviar as alterações da branch `feature/pbi-001-primeiro-incremento-saude`, integrando conforme fluxo revisado develop/release/main do projeto. Não fazer commit direto em main.
3. Depois da integração em main, abrir Actions → Publish WebFit pilot. Com o runner ligado, acompanhar checks, build assinado, rascunho e verificação pública. Se houver falha, corrigir a causa antes de repetir; inspecionar releases/rascunhos existentes.
4. Instalar o candidato 0.1.8 mantendo os dados para receber a faixa superior. A primeira versão publicada pelo pipeline será superior ao bootstrap e conterá latest.json/assinatura. Entrar no aplicativo com internet: ele consulta em cada login; a faixa aparece só se houver versão nova. Confirmar Atualizar agora, conferir backup/reinício e dados fictícios persistidos. Mais tarde adia nesta sessão.

Até essa execução passar, não afirmar que a atualização conectada está operacional. Teste de código e habilitação no arquivo não comprovam publicação.

O candidato inicial 0.1.5 precisa de instalação manual uma vez para receber o novo atualizador. Depois, ensaiar duas versões piloto com dados fictícios: publicação, descoberta, adiar, confirmar, backup, assinatura, instalação/reinício e persistência. O fluxo só é considerado operacional após esses ensaios. Sem internet, o WebFit continua disponível.

Publicações são seriadas; não se promete um instalador por chat. A unidade de publicação é a integração na main. O GitHub pode substituir um job pendente de um grupo de concorrência por outro mais recente; monitorar a versão efetivamente publicada. Se upload falhar, o rascunho fica para inspeção. Se a verificação pública falhar depois de publicar, a release pode já estar pública: não há remoção ou rollback automático.
