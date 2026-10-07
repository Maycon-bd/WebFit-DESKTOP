# Validation guide — WEBFIT-4

Prerequisitos: dependências já instaladas, produto fictício preparado, Windows/WebView de teste; sem instalar dependências nem alterar dados reais. Contrato em [contracts/navigation.md](contracts/navigation.md).

## Automated checks after implementation

Executar da raiz: npm run format:check; npm run lint; npm run typecheck; npm test; npm run build. Comandos separados para diagnóstico. Regressões onboarding relevantes devem permanecer; nenhum teste que apenas procure texto no código.

Para entrega do pacote, verificar DoD: cargo fmt --manifest-path src-tauri/Cargo.toml --check; cargo test --manifest-path src-tauri/Cargo.toml (inclui integração SQLite); cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings; build Tauri sem bundle por npm run tauri -- build --no-bundle. Maycon dispensou geração de instalador local; publicação/distribuição ficam no pipeline/updater após Git humano. Não usar este roteiro para instalar no host ou publicar automaticamente.

## Interactive acceptance

1. Entrar com dados fictícios; observar Consultório/Pacientes, nome clicável e engrenagem adjacente.
2. Editar paciente/prescrição; fechar/reabrir menu e conferir campos e tela. Quando recolhido só hambúrguer permanece da lateral. Repetir em Perfil.
3. Engrenagem → Configurações: ver somente índice de ferramentas, sem evento AUDIT_MODULE_OPEN. Escolher Auditoria e confirmar abertura real/retorno e filtros existentes. Escolher Backup e restauração e conferir ações/retorno sem executar operação sensível indevida.
4. Nome → Acesso/Perfil: conferir destinos, salvamento seguro do rascunho, Escape/foco. Simular falha controlada de save_draft em teste autorizado e conferir permanência na edição/erro; não alterar backend só para o ensaio.
5. Usuário fictício com must_change continua obrigado a trocar senha; logout encerra sessão como antes. Operação busy mantém bloqueios.
6. Conferir tour de pacientes/acesso com menu aberto/fechado e Pular/Ver tutorial. Aviso de atualização mantém estado/adiamento/progresso e consulta por sessão existente.
7. Teclado completo; foco visível; 1366×768, janela reduzida e zoom 200%; nome comprido. Nenhum controle escondido acessível por Tab; sem coluna vazia após recolher.

Registrar TA-UX-NAV-001..008, ambiente, versão/HEAD, capturas e limitações na evidência. Falha ou ausência de acesso à UI não é aprovação visual.
