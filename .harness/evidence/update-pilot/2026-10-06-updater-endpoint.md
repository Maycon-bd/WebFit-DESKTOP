# Endpoint do updater no spike — 2026-10-06

- Fonte: ADR-0002/DEC-043, T082 de `specs/001-primeiro-incremento-saude/tasks.md` e `docs/operations/update-pipeline-design.md`.
- Autorização: Maycon autorizou neste chat adicionar o endereço à configuração local do spike. Não autoriza publicação, disparo do workflow ou implementação de produto.
- Classificação: STRICT, continuidade da preparação autorizada de uma integração externa, somente configuração local nesta etapa.
- Branch: `feature/pbi-001-primeiro-incremento-saude`, HEAD-base `66f886fe2be407803298918c08798af6791fffda`; alterações preexistentes preservadas.
- Alteração: `plugins.updater.endpoints` em `spikes/g4-tauri-foundation/src-tauri/tauri.conf.json` aponta para `https://github.com/Maycon-bd/webfit-desktop-releases/releases/latest/download/latest.json`.
- Verificação: JSON final parseado; endpoint único, HTTPS e exatamente correspondente ao repositório confirmado; chave pública conferida com o arquivo `.pub` local. Diff e whitespace conferidos. Nenhum segredo em código/configuração.
- Não foi executada consulta ao endpoint nem geração de novo instalador. A presença/publicação de `latest.json`, assinatura no pipeline e atualização ponta a ponta permanecem pendentes de T083.

## Revisão estática do workflow antes da publicação

A leitura de `.github/workflows/pilot-release.yml` revelou lacunas em relação ao desenho aprovado:

- o workflow instala dependências e chama a ação de build/publicação, mas não executa explicitamente os checks de Rust/SQLite disponíveis antes de publicar;
- não há etapa explícita de geração/publicação de checksums SHA-256;
- não há verificação pós-publicação de `latest.json`, versão, artefatos e assinatura;
- proteção de `main` e efeito de `workflow_dispatch` ainda precisam ser conferidos; a leitura do YAML não comprova que somente merges revisados acionam uma publicação.

Não houve alteração do workflow nesta etapa. Scripts de lint/testes frontend não existem no `package.json` do spike; não devem ser representados como checks executados. A revisão é local e estática, não substitui revisão independente e validação ponta a ponta.

## Próxima ação

Preparar correções locais do workflow sob autorização específica, usando checks existentes, sem novas dependências ou publicação automática nesta sessão. Concluir a custódia portátil segura da chave/senha antes da primeira publicação. T082/T083 e aprovação específica do G5 continuam abertos.
