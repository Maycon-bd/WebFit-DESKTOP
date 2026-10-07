# RF-UX-002 — informações e acesso administrativo no login

Data: 2026-10-07. DEC-049; TA-UX-002; T098–T100. STRICT por fluxo de autenticação. Refinamento do incremento PBI-001 em execução sob DEC-045, reutilizando specification/plan/tasks e branch feature/pbi-001-primeiro-incremento-saude. WEBFIT-3 é vínculo legado do spike encerrado, não foi reaberto ou marcado Done para o produto. Sem sincronização Plane nesta sessão.

## Escopo e aprovação

Maycon concordou com preparação local sem senha embutida e solicitou ícone (i), nome, versão, crédito exato e forma de entrar como administrador. RF-UX-002, TA-UX-002, spec e plan atualizados antes do código; T098–T100 acrescentados sem substituir tarefas de catálogo. Checklist de requisitos 21/21 marcado; pré-requisitos Spec Kit resolveram a feature existente. Análise de consistência do refinamento: nenhuma nova arquitetura, schema, conta renomeada ou autorização relaxada; setup/login existentes reutilizados. Aprovação nesta conversa é de execução desse escopo, não aceite final G5/G6/G7.

## Implementação

src/LoginInfo.tsx: SVG de informação, dialog nativo com fechamento Escape/Fechar, nome/crédito e versão via getVersion. Preview web usa package.json; falha da consulta nativa informa indisponibilidade. Ação administrativa volta para o login normal com admin preenchido e editável para compatibilidade.

src/App.tsx: em instalação vazia, preparação fica dentro de Acesso do administrador. Nome admin predefinido apenas para setup novo; senha e recuperação continuam definidas pelo administrador e protegidas pelo backend existente. Instalações existentes usam suas credenciais originais. Nenhum mecanismo novo de autenticação ou privilégio.

src/style.css: canto inferior direito reservado, alvo de 44px, painel com altura limitada e rolagem. Layout e identidade atuais preservados.

## Verificação e limites

- npm run check: lint, TypeScript, seis testes Node e build passaram. Aviso de chunk maior que 500kB na árvore com catálogo ampliado; nenhuma otimização fora de escopo.
- npx prettier --check src/App.tsx src/LoginInfo.tsx src/style.css e cargo fmt --check: passaram.
- cargo clippy --all-targets -- -D warnings: exit 0; avisos de cache hardlink do ambiente.
- cargo test: no TEMP padrão, 14/15 passaram e criação de backup falhou com STORAGE. Repetição isolada nesse TEMP também falhou. Com TMP/TEMP locais .artifacts/test-temp-login-info, teste isolado e suíte completa 15/15 passaram. Limite ambiental registrado sem alegar causa definitiva; backend não editado.
- Detector Impeccable nos três arquivos: zero findings. git diff --check passou.
- Navegador integrado não alcançou localhost nem 127.0.0.1:1420; sem screenshot verificado. TA-UX-002/T100 ainda requer Windows/WebView, teclado/foco/zoom, setup e atualização com nome anterior.
- Revisão manual de segurança do diff: nenhuma senha no crédito/informações; consultas/setup/login e autorização existentes preservados. Revisão independente e aceite humano pendentes, sem alegação de Review externo concluído.
- Convergência limitada ao refinamento: T098/T099 construídos/verificados estaticamente; ensaio e pacote ainda pendentes em T100. Restante da feature G5 não declarado convergido.

## Entrega e continuidade

Build frontend inclui o refinamento. O instalador de catálogo 0.1.4 concluído paralelamente antes desta mudança não o inclui. Nenhum novo pacote Tauri, instalação no host, commit/push/PR/release/publicação nesta entrega. Antes de distribuir, gerar novo candidato e ensaiar TA-UX-002. Não usar dados reais.

Git HEAD fa70d8fa4eac712801c2f3297d29e78a0f130bdb; upstream local 0/0. Alterações preexistentes e paralelas de catálogo/versão preservadas; arquivos novos e modificados permanecem no workspace.

Agent Decisions: detalhes técnicos reversíveis (dialog nativo, tamanho 44px, versão dinâmica) provisórios dentro do escopo; nenhuma credencial ou aprovação humana inferida.
