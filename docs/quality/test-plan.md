# Plano de testes — primeiro incremento

**Status:** planejado; execução depende do spike e da implementação.

| Grupo | Escopo | Evidência esperada |
|---|---|---|
| Frontend | fluxos diretos, formulários, validação, estados e teclado | relatório de testes e inspeção |
| Rust | autenticação, autorização, regras e erros | `cargo test` |
| SQLite | migrações, constraints, pesquisa e persistência | testes com banco temporário |
| Segurança | hash, espera, sessão, logs e arquivos privados | testes negativos e varredura |
| Backup | snapshot, manifesto, checksum, rotação e restauração | pacotes fictícios e relatório |
| Falhas | corrupção, disco cheio, permissão e interrupção | resultado sem perda do estado atual |
| Desempenho | RNF-DES-001 a 003 com 2.400 pacientes | métricas e configuração da máquina |
| Acessibilidade | teclado e ampliação de 200% | checklist e capturas/evidência |
| Aceite | TA-AUT, TA-CLI, TA-PAT, TA-AUD e TA-BKP | ata da Sprint Review |

Antes do Gate G5, executar formatação, lint, TypeScript, testes frontend, Rust, SQLite e build Tauri disponíveis. Ausências de comandos devem ser tratadas na fundação.
# Comandos do produto em construção — DEC-045, 2026-10-06

Interface: `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`. Rust: `cargo fmt --manifest-path src-tauri/Cargo.toml --check`, `cargo clippy --locked --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings`, `cargo test --locked --manifest-path src-tauri/Cargo.toml` (inclui persistência SQLCipher/backup e comandos). Para Rust, use o Perl portátil no PATH do processo conforme `scripts/build-installer.ps1`. Empacotamento: `scripts/build-installer.ps1`, lockfile fixado, NSIS x64 e WebView2 offline. Nenhum desses comandos publica release ou instala o produto no cliente.

Evidência e limites dos checks atuais: `.harness/evidence/health-increment/2026-10-06-candidate.md`. Ensaios manuais de instalação, interface/200%, hardware-alvo e restauração operacional continuam necessários; revisão independente e G6/G7 permanecem pendentes.


## RF-UX-001 — tutoriais do MVP (DEC-046)

- Automação Node: primeira visita independente por tela, conteúdo curto e posicionamento nos limites da janela, inclusive viewport equivalente a 200%.
- Integração Rust/SQLCipher: leitura e conclusão exigem sessão; catálogo de IDs fechado; conclusão/pulo persistem após reabrir Service; outro usuário mantém preferências independentes; schema permanece em versão 1.
- Ensaio manual T087: Pular, Escape, Voltar, Próximo, Concluir, Ver tutorial, teclado/foco, rolagem/redimensionamento e ausência de operações clínicas disparadas pelo tour. Instalação/atualização no Windows 10 x64 conforme docs/operations/mvp-local-test.md.
- Limite de evidência: ferramenta visual do navegador falhou ao iniciar por `windows sandbox failed: apply deny-read ACLs`; nenhum teste visual foi declarado aprovado.


## RN-AUT-001 — DEC-047, 2026-10-07

Ensaio backend de limites: hash e setup de senhas com seis caracteres; cinco rejeitado no hash, troca e redefinição; login/troca/redefinição com seis aceitos, senha temporária ainda exige troca; recuperação com onze rejeitada e doze aceita. Testes anteriores com credenciais mais longas preservados. Ensaio manual T090: validação HTML e preparação no novo instalador 0.1.2, com dados fictícios.


## RF-DIS-001 — atualização manual pelo NSIS

Checks do artefato gerado: chave de registro estável, leitura de DisplayVersion e comparação SemVer; opção Atualizar no ramo sem desinstalar; mensagem de reparação para mesma versão; identidade/escopo estáveis. Build real NSIS com idioma customizado deve passar. T093 manual: base fictícia antes/depois, mesma senha, pacientes/perfil/prescrições/tour, único atalho/registro e versão Windows atualizada; instalação limpa e reparação. Não executar instalador no host do agente.
