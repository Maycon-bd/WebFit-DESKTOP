# Ampliação de catálogo — WebFit Desktop 0.1.4

**Status:** implementação, checks e instalador local concluídos; ensaio gráfico/Windows 10 e revisão independente pendentes.

**Autoridade:** continuidade G5 autorizada por DEC-045 e pedido de Maycon para prosseguir com funcionalidades faltantes após retorno geral positivo em 2026-10-07. RF-PRE-002, RN-PRE-001/003/004/006/007, TA-PRE-002/003/005 e T038; subtarefas T094–T097. Não é requisito novo ou ativação do updater.

## Entrega

- 88 registros TBCA 7.3 locais, dos quais os cinco anteriores foram preservados integralmente. Seleção limitada, com preparação, código, URL, composição por 100 g, unidade/valor original e medidas caseiras publicadas.
- Importador stdlib Python `scripts/expand-tbca.py`, cache de respostas públicas em `.tools/tbca-catalog/` e manifesto de 83 registros adicionados em `src/data/tbca-import-manifest.json`, incluindo hashes SHA256 das respostas. Não acessa dados do aplicativo. Importação é uma ferramenta de desenvolvimento; o aplicativo permanece offline.
- Um registro com fibra não quantitativa foi excluído. Dados ausentes/traços preservam valor original e `null`; não viram zero. A seleção utiliza até três registros com prefixo de nome por consulta, sem confundir maçã e macarrão.
- Busca combina palavras em qualquer ordem, ignora acentos/maiúsculas e inclui código. Mostra preparação/fonte e estado vazio; 24 resultados iniciais e Mostrar mais. Escolha `AGENT-PROVISIONAL` de apresentação, reversível, dentro do fluxo aprovado.
- Backend continua resolvendo composição oficial pelo código e rejeitando código desconhecido; quantidade em gramas é a variável da porção. Sem migração, alteração do banco, dependência nova ou mudança arquitetural.
- Versão 0.1.4 alinhada em npm, Cargo e Tauri; identidade/escopo de instalação preservados. Distribuição manual vigente conforme DEC-044/048.

## Verificação

- `npm run format:check`, `npm run check`: lint, TypeScript, seis testes Node e build passaram.
- `cargo fmt --manifest-path src-tauri/Cargo.toml --check`, `cargo test --locked --manifest-path src-tauri/Cargo.toml`: quinze testes Rust passaram, incluindo autorização, persistência, backup/restauração, senha e tours.
- `cargo clippy --locked --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings`: passou.
- `python tests/unit/tbca-import.test.py`: três testes de importação passaram, incluindo decimal, unidade, medida, traço, identidade e rejeição de macro ausente.
- Comparação independente de todos os 83 registros com respostas oficiais em cache e respectivos hashes: passou. Comparação dos cinco registros anteriores com `HEAD:src/data/tbca.json`: idênticos.
- Fixture independente da página oficial BRC0006C: 100 g = 109 kcal, proteína 1,27 g, carboidratos 26,7 g, lipídios 0,19 g, fibras 2,24 g, potássio 346 mg. Backend confirmado para 50 g, preservando precisão e recusando composição adulterada. Original de sódio `tr` continua indisponível.
- Detector Impeccable dos arquivos alterados: sem achados. Ensaio visual não foi executado; automação do navegador estava indisponível neste host na etapa anterior. Detector não substitui aceite gráfico.
- Build frontend aponta aviso de chunk >500 kB (519,61 kB, gzip 105,02 kB); catálogo embutido permanece pequeno para o instalador offline. Não houve medição de desempenho do computador-alvo.
- `scripts/build-installer.ps1`: NSIS x64 0.1.4 concluído. Arquivo `.artifacts/mvp/2026-10-07/catalog-0.1.4/WebFit-Desktop-0.1.4-teste-x64.exe`, 218.910.266 bytes, SHA256 `b319de215610e90b8b348fe0abc96135fec9d327a53dfb839a89795c0c3656dc`, Authenticode `NotSigned`. Manifesto de fontes e SHA256SUMS acompanham o pacote; candidatos anteriores preservados. Template/idioma gerados conferidos com versão 0.1.4 e Atualizar mantendo os dados.
- Avisos de build já presentes: colisão de saída PDB entre bin/lib, STATIC_VCRUNTIME deprecado e símbolos de depuração OpenSSL ausentes; build concluiu. Não representam validação de instalação/assinatura Windows.

## Limites e próxima ação

T038 permanece parcial: base completa e TACO pendentes. Ausência no catálogo local não comprova ausência na TBCA para ativar fallback TACO. Sem publicação/licenciamento externo novo; avisos de fonte mantidos em docs/operations/third-party-notices.md.

Maycon informou que usou/testou e pareceu tudo certo, sem identificar versão nem resultados por critério. Registro positivo de uso; T087/T090/T093 não foram convertidos em aceites específicos. Próximo ensaio: atualizar manualmente, pesquisar/incluir alimento, conferir medida/porção, salvar/reabrir e confirmar preservação, conforme docs/operations/mvp-local-test.md. Somente dados fictícios; G5/G6/G7 não concluídos.

Git inicial: branch `feature/pbi-001-primeiro-incremento-saude`, HEAD `fa70d8fa4eac712801c2f3297d29e78a0f130bdb`, árvore limpa, upstream local 0/0 sem fetch. Divergência em relação ao checkpoint `66f886f` informada antes da primeira alteração. Nenhum commit/push/PR/release efetuado.

Na conferência final surgiram alterações paralelas de RF-UX-002/DEC-049 em requisitos, decisão, Spec Kit, src/App.tsx e src/style.css. Preservadas, sem edição por esta entrega. O instalador de catálogo foi concluído antes dessas alterações e tem manifesto de fontes daquele instante; RF-UX-002 não integra esse pacote. Os checks aqui descritos se referem à versão de catálogo compilada, não à árvore em evolução de outra demanda.
