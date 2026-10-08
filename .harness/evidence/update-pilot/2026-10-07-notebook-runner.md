# Segundo runner — notebook, 2026-10-07

Status: NOT READY para aceitar jobs — runner e Perl verificados/extraídos; registro privado, conexão e validação real pendentes. Continuação STRICT de RF-UPD-001 / DEC-050 / DEC-053, T082/T105/T113. Maycon solicitou instalar runner neste notebook e depois pediu subagentes. Não há nova decisão arquitetural nem alteração de schema.

Contexto observado: branch main, HEAD 667f1ae5b4e0b36f65be8ecd19118075f0c63f77, notebook DESKTOP-MAYCONI. Git e Node 22.16.0 disponíveis; vswhere confirmou Visual Studio 2022 Community com ferramentas VC x64/x86. O workflow seleciona Node 22.18.0 e prepara Rust no cache do runner; não foi instalado toolchain Rust no perfil do usuário nesta etapa. C:/actions-runner estava ausente inicialmente. Não foram lidas credenciais, tokens, chaves ou dados de domínio.

Pacotes oficiais consultados por API GitHub, antes do download:

- [Actions Runner v2.338.0](https://github.com/actions/runner/releases/tag/v2.338.0), actions-runner-win-x64-2.338.0.zip, 104063355 bytes; SHA256 f48e0750a21812bca5f82de5f7f5aeae71abee647fab5a582f1742d07eba455f.
- [Strawberry Perl 5.42.3.1](https://github.com/StrawberryPerl/Perl-Dist-Strawberry/releases/tag/SP_54231_64bit), strawberry-perl-5.42.3.1-64bit-portable.zip, 304765269 bytes; SHA256 6a081a811781c30aca51dbc036afd93092af91e3297901f02c17043795a10690.

Downloads grandes ficaram lentos/interrompidos. Somente processos de download iniciados nesta tarefa foram encerrados; arquivos parciais preservados. Range HTTP foi testado e confirmou status 206 e Content-Range. O subagente adotou fila limitada de trechos de 262144 bytes; cada trecho confere intervalo e tamanho, e o pacote recomposto precisa corresponder ao SHA256 oficial antes da extração. Esta escolha local é AUTO, sem dependência nova ou transmissão de dados do usuário. Partes e helpers ficam em diretórios ignorados .tools/ e .artifacts/.

Resultado do runner: 397/397 trechos concluídos, tamanho e SHA256 exatos. Extraído em C:/actions-runner somente após conferir ausência prévia da pasta. config.cmd e run.cmd presentes; bin/Runner.Listener.exe --version retornou 2.338.0. Não houve registro nem início do runner pelo agente. Resultado de download não comprova disponibilidade no GitHub nem build de SQLCipher.

Registro: Maycon confirmou acesso à página autenticada do GitHub. Helper local .artifacts/updater-notebook/register-notebook.ps1 usa Read-Host -AsSecureString; registro nome DESKTOP-MAYCONI com labels padrão e webfit-notebook. Recusa runner já registrado e não inicia jobs. Permite registrar antes da conclusão do Perl, porque o registro não executa builds. O início em start-notebook.cmd exige Perl completo (perl/bin/perl.exe e c/bin), define WEBFIT_PERL_PATH e usa run.cmd. Sintaxe PowerShell conferida pelo subagente. Política RemoteSigned observada; nenhuma alteração/bypass de política feito. Token temporário deve ser inserido apenas pelo humano em seu terminal privado, sem ser enviado ao chat.

Modo inicial preparado: interativo no perfil User, sem serviço Windows criado. Serviço exigirá definir conta, ambiente e permissões correspondentes; variável User não certifica NetworkService. Não executar serviço e run.cmd simultaneamente no mesmo registro. Nenhuma chave privada é copiada para o notebook: o workflow utiliza os Secrets existentes no GitHub.

Resultado final do Perl: 1163/1163 trechos concluídos, tamanho e SHA256 exatos. Extraído sem sobrescrita em C:/actions-runner/tools/strawberry. Executável identificou Perl v5.42.3; teste com LC_ALL=C/LANG=C (mesmo ambiente do pipeline) passou sem warnings. WEBFIT_PERL_PATH configurada no escopo User e marcador .webfit-perl-ready criado somente após validação completa; start-notebook.cmd exige também esse marcador. Nenhuma instalação de serviço ou início do runner realizados. A última consulta de existência de .runner indicou registro ainda ausente; credenciais não lidas.

Pendências: confirmar registro do notebook pelo humano em seu terminal privado; conferir Listening for Jobs/Idle; build real pelo modo escolhido, incluindo MSVC/SQLCipher; ensaio conectado de duas versões fictícias. A trilha paralela da publicação tem evidência em 2026-10-07-publication-target.md. G5 permanece em execução; G6/G7 pendentes.

Tentativa humana de registro posterior: POST actions/runner-registration retornou HTTP 404 durante Authentication, antes do registro. Existência de .runner continua false; token não acessado. URL do helper confere com o repositório de código. Próxima investigação: gerar token novo na página New self-hosted runner desse mesmo repositório e copiar somente o valor após --token; não usar PAT ou Secret de publicação. Causa exata não confirmada apenas pelo 404. Helper local agora remove espaços externos e rejeita prefixos conhecidos de PAT/comando completo antes de enviar; sintaxe PowerShell PASS. Nenhum token foi solicitado no chat nem nova tentativa feita pelo agente.

Plane: NOT APPLICABLE para esta retomada operacional existente; nenhum Work Item externo criado/alterado. Agent Decisions: 0 decisões materiais novas; escolhas internas AUTO documentadas acima. Nenhum Git mutável no repositório do produto.
