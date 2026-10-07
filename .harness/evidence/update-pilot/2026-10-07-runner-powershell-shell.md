# Segunda falha do runner Windows — 2026-10-07

Demanda: RF-UPD-001 / DEC-053 / T113. Run `up #3`, URL registrada na captura: `actions/runs/37665030572/job/112941954574`. Branch `main`, commit/`origin/main` observado `222a79e0856c555f6a712394bc96bd9f031431af`. Git continua sob controle de Maycon.

## Diagnóstico

O run passou por setup, checkout e setup-node, mas falhou imediatamente em `Prepare compiler environment`. A mensagem `PSSecurityException / UnauthorizedAccess` cita o `.ps1` temporário em `_work\_temp`, antes de executar o comando `node scripts/runner-env.mjs --initialize`. Portanto, executar o helper em Node não bastou: o shell `powershell` do próprio workflow também é bloqueado pela política da conta NetworkService. O job terminou em 25 segundos e nenhuma validação, compilação ou publicação ocorreu. O aviso de Node.js 20 não é a causa.

## Correção preparada

O workflow agora escolhe `cmd` como shell padrão para todos os passos `run`, elimina os blocos PowerShell e valida a variável de release com Node. `runner-env.mjs` cria e exporta TMP/TEMP do job junto com as ferramentas. Não altera ExecutionPolicy nem exige configuração administrativa no host.

## Limite e próxima verificação

A sintaxe do JavaScript pode ser verificada localmente; o checkout deste host não representa a política de execução de `DESKTOP-GEUP094`. Depois da integração humana, o run deve confirmar que todas as etapas `run` iniciam em `cmd` e que o bootstrap passa. Um novo erro posterior precisa ser diagnosticado pela primeira etapa vermelha. Nenhum teste/build/publicação foi executado por esta correção local e nenhuma release foi criada pelos runs #2/#3.
