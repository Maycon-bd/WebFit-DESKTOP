# Notas das atualizações

RF-UPD-002 / WEBFIT-21, implementação autorizada por Maycon em 2026-10-09. Aceite funcional/nativo pendente.

## Para a nutricionista

Após entrar no WebFit, um resumo mostra as novidades da versão instalada. Entendi ou Escape confirma a leitura; o aviso não repete para essa conta na mesma versão. Uma nova versão apresenta seu resumo. Para consultar novamente, clique no nome da sua conta e em Ver novidades. Funciona mesmo sem internet.

Se não for possível guardar a leitura, tente novamente ou use Fechar por agora para continuar. Nesse caso, o resumo poderá aparecer no próximo acesso. A troca obrigatória de senha vem primeiro. Não há alteração de pacientes, prescrições ou rascunhos ao ler as notas.

## Manutenção de cada entrega

1. Atualize `src/data/release-notes.json` junto de mudanças visíveis ao usuário, antes de preparar o candidato. Escreva um título e um a seis tópicos curtos, de até 240 caracteres cada, em português.
2. Descreva ações e benefícios para o consultório: o que foi adicionado ou melhorado e onde encontrar. Inclua apenas o que está implementado nessa entrega; não anuncie funções futuras ou aceite clínico.
3. Evite nomes de bibliotecas, IDs de tarefas, hashes, logs, termos de banco/infraestrutura e qualquer dado pessoal ou clínico. Conteúdo é texto simples, sem HTML.
4. Execute `node scripts/check-release-notes.mjs`, revise editorialmente o texto e confira o diálogo em tela/zoom. `npm run build` recusa notas ausentes/vazias/inválidas; não consegue comprovar sozinho que as notas estão atualizadas ou que a linguagem é adequada.
5. O staging do piloto usa o mesmo resumo no manifesto pré-atualização. A versão mostrada ao backend vem do binário (`CARGO_PKG_VERSION`), incluindo sufixo piloto gerado pelo pipeline. Não existe versão duplicada a atualizar no JSON.

Leitura persistida em `settings` existente, por usuário e versão; comandos autenticados derivam identidade/versão no backend. Backup/restore preservam a preferência, portanto restaurar uma cópia anterior à leitura pode fazer o resumo reaparecer. Primeira instalação também mostra notas não lidas da versão atual. Não mantém histórico de versões antigas nem recebe notas por rede no pós-login. Mudanças futuras devem atualizar esta fonte conforme AGENTS.md.

## Verificação e limites

Fixtures Rust verificam autorização, rejeição de parâmetros de identidade/versão, isolamento por usuário/versão, reabertura e backup/restauração. Chrome com IPC fictício verifica apresentação automática/manual, Escape/foco, relogin, nova versão, falhas/recuperação, viewport 640 e zoom 200%. Esses checks não substituem ensaio Windows/WebView2, instalação/atualização real ou aceite humano. Evidência final em [task.md](../../specs/WEBFIT-21/task.md).
