# Desenho do pipeline de atualização piloto

## Revisão vigente — 2026-10-07 (DEC-053)

Workflow da raiz habilitado localmente para main conforme DEC-053; usuário escolheu executar Git. Os runs remotos #2 e #3 falharam por política PowerShell, corrigida localmente ao usar `cmd` nas etapas. O run #4 passou pelo shell e iniciou o bootstrap, mas o rustup falhou ao baixar `rustc` após erro de stream de rede. A tentativa posterior com curl também falhou com transferência parcial. A correção autorizada em 2026-10-07 volta ao backend padrão, com três tentativas limitadas apenas para falhas transitórias, mantendo versões fixadas e verificação de integridade. Nova execução, publicação e ensaio conectado permanecem pendentes; não declarar remoto ativo até comprovar. Um runner válido basta; notebook adicional depois. Distribuição manual vigente até validação completa. [Guia de integração](own-runner-setup.md), [evidência do primeiro bloqueio](../../.harness/evidence/update-pilot/2026-10-07-runner-execution-policy.md), [evidência do segundo](../../.harness/evidence/update-pilot/2026-10-07-runner-powershell-shell.md) e [evidência do terceiro](../../.harness/evidence/update-pilot/2026-10-07-rust-download-stream.md).

**Status:** preparação G5; wiring local preparado, configuração externa e primeira publicação ainda pendentes.

## Procedimento provisório vigente

Até o pipeline com runner Windows e o updater serem implementados, validados e ativados, as novas versões serão entregues por instalador e aplicadas manualmente com **Atualizar mantendo os dados**, sem desinstalação manual. Esta regra foi reafirmada por Maycon em 2026-10-07. Runner já instalado não equivale a atualização automática ativa. Procedimento completo em [installation.md](installation.md) e [update-release-strategy.md](update-release-strategy.md).

## Gatilho preparado — ativação pendente

1. feature é revisada e integrada em develop;
2. release é estabilizada;
3. merge revisado em main dispara o workflow piloto;
4. commit direto em main permanece bloqueado.

## Etapas do workflow

1. validar checkout e versão SemVer piloto;
2. executar format, lint, TypeScript, testes Rust, SQLite e aceitação disponíveis;
3. gerar NSIS e artefatos do updater;
4. assinar os artefatos com segredo do pipeline;
5. gerar latest.json e publicar artefatos, assinaturas e metadados no repositório público separado;
6. baixar os arquivos públicos e conferir versão, plataforma Windows x64, URLs, tamanhos e assinaturas com a chave pública configurada no produto;
7. conferir que o endpoint latest entrega o mesmo manifesto;
8. comparar SHA256 dos bytes publicados com SHA256SUMS preparado e enviado com os demais assets.

Preparação local retomada em 2026-10-07: checkout do commit exato em main, npm ci, format/lint/TypeScript/testes/build frontend, rustfmt/Clippy/testes Rust/SQLite, versão única acima do bootstrap, NSIS assinado, verificação local e staging vazio. Scripts Node nativos criam release em rascunho, conferem tamanho/estado de cada upload, publicam e verificam o endpoint público sem enviar token aos downloads. Versão deve avançar sobre a última publicação. SQLCipher exige Perl completo acessível à conta do serviço. A chave privada só é disponibilizada ao passo de build; token só aos passos de publicação/verificação. Falha posterior à publicação pode deixar a release pública e exige inspeção, sem rollback automático.

Execução manual é limitada à main, publicações são serializadas e a versão inclui número da execução e tentativa para evitar sobrescrever uma release anterior em reexecuções. Isso não substitui proteção de branch nem comprova que o merge foi revisado. A verificação ocorre depois que a ação publica: uma falha marca o job como falho, mas não remove a release nem impede que o manifesto já público seja consultado. Não há rollback automático. Essa limitação deve ser avaliada antes da primeira publicação. Evidência: [workflow local](../../.harness/evidence/update-pilot/2026-10-06-workflow-verification.md).

## Runner

- runner Windows auto-hospedado no computador de Maycon;
- conexão de saída HTTPS;
- sem dados clínicos no workspace do pipeline;
- atualizações do runner controladas e registradas;
- workflow de pull request não executa código não confiável no runner;
- se o runner estiver offline, a publicação aguarda ou usa o procedimento manual de contingência.

## Segurança de publicação

- nenhum token GitHub fica no aplicativo;
- segredo da assinatura só é disponibilizado ao job de publicação;
- repositório público contém somente artefatos assinados, checksums, manifesto e notas;
- o pipeline falha se testes, assinatura, manifesto ou publicação pós-verificação falharem;
- a publicação do piloto não instala nada na máquina da nutricionista.

## Promoção estável

O canal estável exige versão/tag aprovada, validação do candidato, decisão de promoção após G7 e atualização do manifesto estável. A promoção não ocorre automaticamente a cada merge na main.

## Contingência

Se o pipeline ou endpoint estiver indisponível, Maycon pode distribuir manualmente o instalador NSIS assinado. A operação do WebFit continua offline; a atualização pode esperar.

## Configuração externa pendente (T082)

O workflow local está em `.github/workflows/pilot-release.yml`. Para ativá-lo, configurar manualmente no GitHub:

- repositório público separado somente para releases, cujo nome será informado na variável `WEBFIT_RELEASE_REPO`;
- runner auto-hospedado com os labels `self-hosted`, `windows` e `x64`;
- secret `WEBFIT_RELEASE_TOKEN`, limitado ao repositório de artefatos;
- secret `TAURI_SIGNING_PRIVATE_KEY`, criado a partir da chave privada mantida fora do repositório;
- secret `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`, armazenado somente no cofre de secrets;
- proteção de branch para que somente merges revisados na `main` acionem o piloto.

Em 2026-10-06, as imagens fornecidas por Maycon confirmaram `WEBFIT_RELEASE_REPO = webfit-desktop-releases` e a presença de `WEBFIT_RELEASE_TOKEN`. Maycon posteriormente cadastrou os dois secrets de assinatura após autorização específica; a imagem fornecida confirma os três nomes esperados. Valores e funcionamento no pipeline não foram consultados ou validados. O runner foi corrigido e validado após reiniciar o Windows, com `RUNNING` e `Listening for Jobs`; ver o checkpoint canônico em [status.md](../project/status.md).

O endpoint `https://github.com/Maycon-bd/webfit-desktop-releases/releases/latest/download/latest.json` foi configurado localmente no spike em 2026-10-06 após autorização específica de Maycon. JSON, HTTPS e correspondência da chave pública foram verificados. Ainda exige validação após a publicação de `latest.json`; a configuração local não comprova que o manifesto está publicado. Evidência e lacunas do workflow: [endpoint local e revisão estática](../../.harness/evidence/update-pilot/2026-10-06-updater-endpoint.md).

## Custódia da chave do piloto

Em 2026-10-06, Maycon autorizou substituir a chave de assinatura local do piloto após informar que não possuía a senha anterior. A chave antiga foi preservada. A nova chave está fora do repositório, em `C:\Users\Maycon Garcia Silva\.tauri\webfit-pilot-updater-20261006.key`; a senha aleatória está criptografada por DPAPI CurrentUser no arquivo correspondente `.key.password.dpapi`. A chave pública do spike foi atualizada e a assinatura foi verificada, incluindo rejeição de arquivo alterado. Evidência: [rotação local da chave](../../.harness/evidence/update-pilot/2026-10-06-signing-key-rotation.md).

A recuperação DPAPI exige o mesmo perfil Windows. Cadastro dos secrets confirmado pelo usuário e pela imagem; custódia portátil segura e teste de assinatura no pipeline continuam pendentes; nenhum valor deve ser exibido no chat ou versionado. Instaladores antigos do spike precisam ser substituídos para confiar na nova chave pública. Esta preparação não conclui T082/T083 nem autoriza publicação ou implementação de produto.

Custódia no Bitwarden confirmada por Maycon em 2026-10-06: chave e senha salvas em nota segura e reabertas após novo login. Conteúdo não consultado pelo agente; restauração criptográfica a partir do cofre ainda não testada.

### Formatação no checkout Windows reutilizado

.gitattributes define LF para fontes. Em runner próprio, arquivos inalterados podem continuar CRLF após integrar a regra; .prettierrc.json usa endOfLine=auto para evitar falso erro de final de linha. A etapa format:check permanece ativa e rejeita formatação inválida. Não apagar/recriar o checkout ou desativar validações para contornar esse caso. Evidência: .harness/evidence/update-pilot/2026-10-07-checkout-line-endings.md.
