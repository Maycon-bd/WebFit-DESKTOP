# Lembrar somente o nome — RF-AUT-004 / DEC-052

2026-10-07. STRICT, autenticação. Maycon pediu checkbox Lembrar de mim e escolheu explicitamente preencher apenas nome e continuar pedindo senha. Refinamento do incremento G5 sob DEC-045, branch feature/pbi-001-primeiro-incremento-saude, HEAD fa70d8fa4eac712801c2f3297d29e78a0f130bdb. Artefatos existentes Spec Kit atualizados antes do código, sem nova specification concorrente. Pré-requisitos resolveram a feature existente; checklist de baseline já aprovado. WEBFIT-3 preservado como vínculo legado do spike encerrado, sem reabertura/Done indevido ou sincronização externa nesta sessão.

## Implementação e rastreabilidade

RF-AUT-004 -> TA-AUT-005 -> T108–T110. Checkbox abaixo de Senha, dica explícita de que só salva o nome. Formulário lê a preferência na abertura, não sobrescreve edição com resposta tardia e nunca recebe senha/token dessa consulta. Persistência após login válido; falha de preferência informa recuperação e não impede login válido. Desmarcar e entrar remove a preferência do papel.

RememberedLogin retorna somente nome do usuário ativo anteriormente escolhido; não aceita consulta SQL ou UUID arbitrário. RememberLogin exige sessão válida e deriva papel/UUID do usuário autenticado. Apenas UUID em settings criptografada existente, separado por ADMIN/NUTRITIONIST. Sem senha/token persistido, migração, dependência ou localStorage. Contas/bloqueio/esperas/auditoria existentes preservados. Backup consistente existente pode carregar a preferência; isso não concede sessão no destino.

## Verificação

npm run check passou: lint, TypeScript, seis testes Node e build frontend. npm run format:check e cargo fmt --check passaram. Detector Impeccable nos arquivos de UI retornou zero findings.

cargo test: 18/18 passaram com TMP/TEMP locais .artifacts/test-temp-remember-login. Teste remembered_login_is_opt_in_authorized_and_scoped_without_credentials verifica opt-in, negar gravação anônima, preservar preferência após senha inválida, persistir na reabertura, negar perfil sem sessão, separar papéis, guardar somente UUID e remover na reabertura. Durante a escrita do teste, corrigidas pré-condições: chamada sem token encerra sessão conforme segurança existente, e credenciais da fixture são Nutricionista de teste/outra senha ficticia. Nenhuma mudança de segurança para acomodar teste. cargo clippy --all-targets -- -D warnings passou após corrigir needless_borrow no teste.

Build frontend tem aviso de chunk >500 kB; compilação Rust tem avisos de cache hardlink/PDB/STATIC_VCRUNTIME já conhecidos. Nenhum deles convertido em falha funcional. Empacotamento inicial falhou ao baixar NSIS por DNS no sandbox; repetição com acesso à rede autorizado em andamento, resultado registrado abaixo.

Análise de consistência e revisão manual de segurança do refinamento: entrada nome/checkbox, saída apenas nome e UUID, backend autorizado, sem sessão persistente; TA-AUT-005 rastreável. Convergência do código limitada a T108/T109, não à feature inteira. T110, ensaio gráfico Windows e revisão independente pendentes. Navegador integrado não acessou previews locais nos ensaios anteriores desta conversa; nenhum ensaio visual ou screenshot alegado aqui.

## Limites

Dados fictícios. G5 em execução, G6/G7 não concluídos. Preservadas alterações preexistentes/paralelas de catálogo, login, updater/pipeline e documentação. Versão de candidato 0.1.7 para diferenciar atualização manual de 0.1.6; sem assinatura/publicação/ativação do updater. Nenhuma instalação no host, commit/push/PR/merge/release.

Agent Decisions: armazenamento por papel em settings, retorno de UUID para persistência interna e proteção contra leitura tardia são detalhes técnicos reversíveis dentro da solicitação aprovada. Não representar ensaio pendente como aceite humano.

## Pacote concluído

Build NSIS 0.1.7 passou na repetição com rede autorizada, após falha inicial de DNS. Artefato: .artifacts/mvp/2026-10-07/remember-0.1.7/WebFit-Desktop-0.1.7-teste-x64.exe. Bytes: 219635591. SHA256: 66caaa4911cb1450ab082d1e0f54c503e34deedefaba0ca472701679372139b2. Authenticode: NotSigned. Roteiro, checksum e manifesto de fontes acompanham. Pacotes anteriores preservados. Ensaio TA-AUT-005/T110 e revisão independente pendentes.

Na conferência final apareceram alterações paralelas adicionais de harness/comunicação e src/update-check.ts/tests/unit/update-check.test.ts. Preservadas sem edição. Checks e pacote relatados referem-se ao instante de compilação deste refinamento; não comprovam inclusão/validação de alterações feitas posteriormente por outra sessão. Manifesto de fontes marcado explicitamente como snapshot no staging, não snapshot atômico da compilação. Não reabrir ou alterar trabalho paralelo para ajustar essa evidência.
