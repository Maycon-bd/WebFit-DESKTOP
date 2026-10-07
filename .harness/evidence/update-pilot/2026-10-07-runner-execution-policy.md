# Falha de bootstrap do runner — 2026-10-07

Demanda: RF-UPD-001 / DEC-053 / T113. Branch observada `main`, HEAD e `origin/main` `44c0c495a3266a1729ea6ed19d55df1671f40fee`. Maycon controla as operações Git; nenhuma operação remota foi executada pelo agente.

## Diagnóstico

Captura do Actions run `up #2`: o job `publish-pilot` iniciou em `DESKTOP-GEUP094`, passou por checkout e setup do Node e falhou em `Prepare compiler environment` ao invocar `scripts/runner-env.ps1`. A mensagem do PowerShell informa que execução de scripts está desabilitada; classificação `PSSecurityException / UnauthorizedAccess`. A anotação de Node.js 20 é aviso de depreciação, não a causa. O job terminou em 27 segundos; validação de repositório, testes, build e publicação não iniciaram. Não há evidência de falha de token, assinatura ou updater neste run.

## Correção preparada localmente

O workflow passa a executar `scripts/runner-env.mjs` usando o Node já preparado por `actions/setup-node`. O bootstrap mantém Rust/Rustup fixos, valida SHA-256 do instalador obtido da origem oficial, configura caches isolados, valida Perl completo/ferramentas e exporta ambiente para os passos seguintes. Isso evita depender de execução de arquivos PowerShell e não altera a política do Windows ou do serviço.

`docs/operations/own-runner-setup.md`, `docs/operations/update-pipeline-design.md`, T113 e `docs/project/status.md` foram atualizados. A mudança permanece local para revisão e integração por Maycon. Nenhuma credencial foi acessada, nenhum build/release foi produzido e nenhuma operação Git externa foi feita.

## Próxima verificação

Depois da integração humana, observar o próximo run. Se passar do bootstrap, analisar a primeira falha subsequente (se houver); só depois do build, assinatura, publicação e verificação pública será possível validar a faixa no aplicativo.
