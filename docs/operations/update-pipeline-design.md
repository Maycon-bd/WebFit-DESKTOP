# Desenho do pipeline de atualização piloto

**Status:** preparação G5; wiring local preparado, configuração externa e primeira publicação ainda pendentes.

## Gatilho

1. feature é revisada e integrada em develop;
2. release é estabilizada;
3. merge revisado em main dispara o workflow piloto;
4. commit direto em main permanece bloqueado.

## Etapas do workflow

1. validar checkout e versão SemVer piloto;
2. executar format, lint, TypeScript, testes Rust, SQLite e aceitação disponíveis;
3. gerar NSIS e artefatos do updater;
4. assinar os artefatos com segredo do pipeline;
5. calcular checksums;
6. gerar latest.json;
7. publicar somente artefatos, notas e metadados no repositório público separado;
8. executar uma verificação pós-publicação;
9. disponibilizar o manifesto para o aplicativo.

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

Depois que o nome do repositório for definido, o endpoint deverá ser gravado em `spikes/g4-tauri-foundation/src-tauri/tauri.conf.json` como o download estático `https://github.com/Maycon-bd/<release-repo>/releases/latest/download/latest.json`. Ele não foi inventado nem configurado localmente porque o repositório ainda não existe.