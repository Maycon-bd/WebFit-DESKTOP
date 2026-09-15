# Git/GitHub

Status: **Git local ACTIVE; automações GitHub PREPARED — NOT ACTIVE.**

Repositório oficial: `Maycon-bd/WebFit-DESKTOP`. A convenção aprovada é DEC-010 e [docs/project/git-workflow.md](../../docs/project/git-workflow.md); este documento não cria um fluxo concorrente.

## Protected Branches

- `main`: releases ou estado pronto para liberação; nunca recebe demanda real diretamente.
- `develop`: integração; não recebe trabalho direto de uma demanda.
- `master`: tratada defensivamente como protegida enquanto existir.
- Outros ramos declarados protegidos pela configuração ou documentação do projeto.

## Local Branch Setup

Para demanda real STANDARD ou STRICT:

1. identificar branch atual e refs locais/remotas já conhecidas;
2. verificar `git status --short --branch`;
3. localizar branch já associada ao ID da demanda;
4. obter ID rastreável aprovado e slug minúsculo com hífens;
5. confirmar a base exigida por DEC-010;
6. reutilizar ou criar localmente `feature/<id>-<resumo>` a partir de `develop`;
7. somente então permitir alterações versionáveis e associar os artefatos Spec Kit.

`hotfix/<id>-<resumo>` permanece reservado a correção urgente aprovada e parte de `main`. Não introduzir `fix/`, `chore/` ou outra convenção enquanto DEC-010 estiver vigente.

Se `develop` não existir localmente e `origin/develop` já estiver disponível, pode-se criar seu tracking local e depois a feature, desde que o worktree esteja limpo e a ref seja inequívoca. Não executar fetch, pull ou atualização remota automaticamente. Se a base estiver ausente ou divergente, parar em `BRANCH SETUP BLOCKED`.

## Dirty Worktree

- Branch atual já associada e alterações atribuíveis à demanda: preservar e continuar.
- Alterações da demanda sobre a base correta, com criação local inequivocamente segura: criar a branch preservando-as.
- Alterações não relacionadas, origem incerta, base incorreta, conflito potencial ou necessidade de stash/reset/clean: não trocar nem criar branch; retornar `BRANCH SETUP BLOCKED`.
- Nunca usar reset destrutivo, clean, checkout de descarte, stash automático ou exclusão de arquivos para viabilizar a troca.

## Authority

Permitido autonomamente: inspeção Git somente leitura; criação, tracking e troca de branch exclusivamente local quando todos os critérios de segurança forem satisfeitos.

Exigem autorização explícita: fetch/pull quando alterarem o estado usado pela demanda, commit, push, PR, merge, tag, release, CI mutável e qualquer operação externa.

Branch local não substitui Implementation Approval, Sensitive Change Approval ou Final Approval.
