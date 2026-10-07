# RF-UPD-001 — preparação local do produto/pipeline

Data: 2026-10-07. Autoridade: DEC-050 / ADR-0002, continuação G5/DEC-045. Branch `feature/pbi-001-primeiro-incremento-saude`; HEAD/base `fa70d8fa4eac712801c2f3297d29e78a0f130bdb`, upstream local 0/0 sem fetch. Worktree contém catálogo e RF-UX-002 paralelos preservados. Somente dados fictícios; sem commit/push/publicação, instalação no host ou acesso aos valores de secrets.

## Implementado

- Produto 0.1.5 recebe crate nativo tauri-plugin-updater 2.12.0, lockfile e licenças transitivas. Sem plugin frontend ou permissão genérica de instalação. Chave pública/endpoint são configuração pública; código do spike não promovido.
- Comandos autenticados consultam manifesto e instalam somente a versão piloto confirmada, com origem restrita ao repositório público aprovado, HTTPS e NSIS. Backup consistente/validado antes do download; autorização novamente antes de instalar; operações do Service bloqueadas durante a atualização. Falhas anteriores à instalação liberam o uso. Auditoria não contém conteúdo clínico ou credenciais.
- Painel apresenta aviso/ícone, notas, confirmar, adiar, consulta manual e progresso. Instalação exige lista de pacientes sem edição e nenhuma operação ocupada. Consulta automática silenciosa com cache de 24 h **durante o processo**, renovado após reinício. Preferência diária persistente e aviso na bandeja do Windows não implementados; painel dentro do aplicativo não comprova bandeja. React StrictMode reutiliza a promessa de consulta, sem perder o resultado no remontar.
- Workflow guardado: push main/manual, runners próprios `[self-hosted, windows, x64]`, checkout do SHA exato, checks da raiz, versão piloto única acima do bootstrap, assinatura, staging vazio, rascunho, conferência dos uploads, publicação e verificação pública. Recusa versão que não avança. Não há garantia de uma release por chat/merge quando há jobs pendentes substituídos pelo GitHub.
- Scripts de publicação não foram executados contra GitHub. Token restrito a API/uploads; downloads públicos sem token. Falha antes da publicação preserva rascunho; falha de verificação depois da publicação pode deixar release pública. Rollback não automático.

## Verificações executadas

| Check | Resultado | Limite |
|---|---|---|
| npm run check | PASS: lint, TypeScript, seis testes Node e build | aviso de chunk acima de 500 kB; sem ensaio visual |
| npm run format:check; cargo fmt --check | PASS | arquivos de scripts Node fora da configuração Prettier foram conferidos com node --check |
| cargo clippy --locked --all-targets -- -D warnings | PASS | Perl portátil, locale C |
| cargo test --locked | PASS: 17 testes | SQLCipher/backup com TMP/TEMP do projeto; integração updater usa banco fictício |
| node --test scripts/pilot-release.test.mjs scripts/prepare-pilot.test.mjs scripts/stage-pilot.test.mjs | PASS: seis testes | fixture Ed25519 em memória; rejeita adulteração/chave/comentário/origem/versão/saída anterior; staging completo local |
| scripts/check-runner.ps1 | Ready=True no perfil Maycon | não comprova ferramentas na conta do serviço |
| sc.exe query / qc | RUNNING, Auto delayed, NetworkService | consulta somente leitura; não comprova runner disponível no GitHub nem build pela conta |
| npm run tauri -- build --bundles nsis -- --locked | PASS: NSIS 0.1.5, 219.630.262 bytes | Authenticode NotSigned; build bootstrap sem assinatura de updater; não instalado |

Candidato inicial: `.artifacts/mvp/2026-10-07/updater-0.1.5/WebFit-Desktop-0.1.5-teste-x64.exe`; SHA256 `6486a78527caaf611212784489c0b99e44bb4fcafd2193c0adeb70f68cb0b7ab`. Roteiro, checksum e manifesto de hashes das fontes acompanham o pacote. Inclui catálogo e refinamento do login, além do updater. Duas compilações: a segunda incorpora ajustes finais de ícone/rolagem e recursos; apenas o segundo pacote foi entregue. Avisos existentes STATIC_VCRUNTIME/PDB OpenSSL e chunk Vite não impediram build. Não confundir assinatura do updater (futura publicação) com Authenticode/avisos Windows.

O primeiro teste de bloqueio falhou porque a fixture enviava token incorreto **depois** do login: a política existente bloqueia a sessão nessa situação. Corrigida a ordem da fixture, mantendo teste de acesso negado antes do login e autorização válida depois. Não removido controle do produto.

## Análise e pendências

Análise de consistência limitada à retomada RF-UPD-001: um requisito, cinco tarefas, cobertura de tarefas 100%; nenhum item sem tarefa neste recorte. Achado I1 MEDIUM: Primary Dependencies descrevia dependência somente no spike, divergindo da seção Retomada DEC-050. Após encerrar a análise somente leitura, a documentação foi alinhada à DEC-050 no trabalho de implementação/documentação já autorizado pelo usuário; achado resolvido. Constitution histórica menciona fundação apenas no spike, mas registra precedência de decisões humanas/ADR posteriores; DEC-042/ADR-0001 e DEC-045 autorizam o produto. Constituição não alterada por inferência. A análise não equivale a revisão independente nem análise completa de todos os requisitos clínicos.

T101 parcial: workflow preparado; ferramentas da conta do serviço e notebook pendentes. T102 código/testes locais concluídos; T103 painel construído com ensaio visual e bandeja pendentes. T104 preparação e build inicial verificados; assinatura real com a chave do piloto não executada nesta sessão. T105/T082/T083 aguardam revisão, configuração do segundo runner, ativação/publicação aprovadas e teste com duas versões. UPD-001–UPD-015 **não declarados aprovados** pelos testes locais: assinatura no aplicativo real, interrupção, instalação/reinício, migração, retorno e preservação no alvo exigem ensaio integrado. Não houve mudança de schema nesta entrega.

Licença do código WebFit/distribuição externa dos componentes permanece a revisar antes de publicar. G5 em execução; G6/G7 pendentes. Atualização manual mantém vigência. Guia das máquinas: docs/operations/own-runner-setup.md.
