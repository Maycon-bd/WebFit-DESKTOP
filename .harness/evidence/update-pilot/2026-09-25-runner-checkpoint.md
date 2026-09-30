# Checkpoint do runner Windows — 2026-09-25

## Estado confirmado

- Repositório de releases: `https://github.com/Maycon-bd/webfit-desktop-releases`.
- Runner registrado no repositório `Maycon-bd/WebFit-DESKTOP`.
- Nome do runner: `DESKTOP-GEUP094`.
- Diretório local: `C:\actions-runner`.
- Versão observada: `2.337.0`.
- Labels observados: `self-hosted`, `Windows`, `X64`.
- Execução manual: aprovada; o runner exibiu `Connected to GitHub` e `Listening for Jobs`.
- Serviço Windows: instalado, mas não inicia com a conta `AUTORIDADE NT\\SERVIÇO DE REDE`; erro 1068.

## Segurança

- Tokens de registro não fazem parte desta evidência.
- Não registrar token de publicação, chave privada ou senha.
- O serviço não deve ser ativado em workflow de pull request.
- O runner permanece sem publicação até concluir a configuração externa e a validação do workflow; o ADR-0002 já foi aceito por Maycon.

## Próxima ação

Na outra máquina, ler `docs/project/status.md`, confirmar o branch/HEAD e resolver o serviço do runner sem executar `config.cmd` novamente. Depois verificar apenas a existência dos nomes `WEBFIT_RELEASE_REPO`, `WEBFIT_RELEASE_TOKEN`, `TAURI_SIGNING_PRIVATE_KEY` e `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`, sem revelar valores.