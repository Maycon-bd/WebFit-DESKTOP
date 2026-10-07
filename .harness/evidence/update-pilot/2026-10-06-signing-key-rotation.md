# Rotação local da chave de assinatura do piloto — 2026-10-06

## Escopo e autoridade

- Classificação: STRICT, por envolver credencial de assinatura e configuração de confiança do updater.
- Trilha existente: ADR-0002/DEC-043, preparação T081 e configuração parcial T082 de `specs/001-primeiro-incremento-saude/tasks.md`; não é implementação de produto.
- Maycon informou não possuir a senha da chave anterior. Autorizou neste chat gerar uma nova chave do piloto e atualizar a chave pública do spike, preservando a antiga. A autorização inicial cobriu somente a rotação local; posteriormente Maycon autorizou separadamente o cadastro dos secrets no GitHub. Publicação e G5 não foram autorizados.
- Branch associada existente: `feature/pbi-001-primeiro-incremento-saude`; HEAD `66f886fe2be407803298918c08798af6791fffda`. Alterações documentais anteriores do harness/skills preservadas; não houve troca de branch, commit ou push.

## Estado observado e alteração

- Imagens fornecidas por Maycon: variável `WEBFIT_RELEASE_REPO` com valor `webfit-desktop-releases`; secret `WEBFIT_RELEASE_TOKEN` presente; secrets de assinatura inicialmente ausentes. Após autorização específica e transferência direta dos valores, Maycon confirmou o cadastro de ambos e forneceu imagem com os três nomes esperados. Valores de secrets não consultados; validade do token não verificada.
- Chave anterior em `C:\Users\Maycon Garcia Silva\.tauri\webfit-g4-updater.key`; senha vazia rejeitada pelo CLI. Variável de senha ausente ou vazia nos escopos Process/User/Machine consultados. A chave anterior e sua chave pública foram preservadas.
- Nova chave em `C:\Users\Maycon Garcia Silva\.tauri\webfit-pilot-updater-20261006.key`, acompanhada de `.key.pub` e `.key.password.dpapi`.
- Senha aleatória gerada com `RandomNumberGenerator` (32 bytes); armazenada somente criptografada por DPAPI com `CurrentUser`. Nenhum segredo exibido ou gravado no repositório durante a geração; o cadastro posterior no GitHub foi autorizado separadamente e realizado pelo usuário, conforme registro abaixo. A senha foi passada ao CLI pela API Node em memória, sem colocá-la na linha de comando do processo.
- `spikes/g4-tauri-foundation/src-tauri/tauri.conf.json`: alteração somente de `plugins.updater.pubkey` para a nova chave pública. Nenhum endpoint adicionado.

## Verificação

- CLI Tauri já instalado; nenhuma dependência adicionada. Flags confirmadas por `signer generate --help` e `signer sign --help`.
- Geração pela API Node do CLI existente: `signer generate`, com arquivo de destino novo e sem `--force`; saídas capturadas e omitidas para não expor a chave privada.
- Recuperação DPAPI da senha confirmada e comparada em memória com a senha original.
- Arquivo descartável assinado pela nova chave; identificador da assinatura comparado ao da chave pública.
- Assinatura Ed25519 verificada independentemente com `node:crypto`, incluindo prehash BLAKE2b quando indicado pelo formato minisign. Alteração de um byte do arquivo foi rejeitada pelo mesmo verificador.
- JSON final parseado; chave pública configurada comparada ao arquivo `.pub` da nova chave.
- Arquivos e helpers temporários de verificação removidos por seus caminhos literais; nenhum segredo em arquivos temporários. Chaves permanentes preservadas.
- Diff do spike inspecionado: somente a chave pública foi alterada. `git diff --check` aplicado aos arquivos da entrega.
- Não foi feito novo build/instalador nem repetida a suíte frontend/Rust/SQLite: não houve mudança em código, banco ou comportamento de aplicação. O teste executado cobre a alteração de confiança da assinatura; build e validação de atualização ponta a ponta continuam pendentes em T083.

## Limitações e próxima ação

- DPAPI permite recuperação somente no perfil Windows que protegeu o arquivo. É necessária custódia portátil segura da chave e da senha antes de publicação, sem registrá-las em texto claro no chat ou repositório.
- Instaladores antigos do spike confiam na chave pública anterior e precisarão ser substituídos por um novo instalador para aceitar atualizações assinadas pela nova chave. A chave anterior não foi apagada nem considerada comprometida.
- Cadastro dos dois secrets de assinatura no GitHub autorizado por Maycon e executado manualmente por ele com transferência direta pelo clipboard, sem impressão dos valores. Maycon confirmou a conclusão e forneceu imagem dos nomes `TAURI_SIGNING_PRIVATE_KEY`, `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` e `WEBFIT_RELEASE_TOKEN`. Valores não consultados nem validados por execução do pipeline. GitHub CLI não foi localizado no PATH; não foi instalado.
- T082/T083 permanecem abertos. Publicação, revisão independente da entrega global e implementação de produto continuam sujeitas aos respectivos gates.

## Agent Decisions

- Detalhes locais de execução: senha aleatória, arquivo com data sem sobrescrita, DPAPI CurrentUser e helpers temporários sem conteúdo secreto; aplicados no escopo da geração autorizada. A custódia portátil não foi tratada como concluída.
- Nenhuma decisão de produto ou arquitetura alterada; nenhuma aprovação humana inferida para publicação ou G5.

## Custódia confirmada posteriormente

Custódia no Bitwarden confirmada por Maycon em 2026-10-06: chave e senha salvas em nota segura e reabertas após novo login. Conteúdo não consultado pelo agente; restauração criptográfica a partir do cofre ainda não testada. Limitação anterior de ausência de cópia portátil resolvida pela confirmação humana; não equivale a teste de assinatura usando uma chave restaurada.
