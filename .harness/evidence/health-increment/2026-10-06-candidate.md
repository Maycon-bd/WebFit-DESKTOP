# Candidato local de teste — WebFit Desktop 0.1.0

**Data:** 2026-10-06. **Autoridade:** DEC-045, Maycon; DEC-044 mantém instalação manual. **Branch:** `feature/pbi-001-primeiro-incremento-saude`. **Commit-base:** `66f886fe2be407803298918c08798af6791fffda`; fontes novas/alteradas ainda sem commit. Sem consulta/sincronização remota nesta execução, push, PR ou publicação.

## Resultado e limites

Produto novo na raiz, sem copiar o spike G4: interface React/TypeScript/Vite e fronteira Tauri/Rust com SQLCipher Community/DPAPI. Acessos locais, sessão, perfil, pacientes/tags, prescrições versionadas, rascunhos temporários, auditoria e backup/restauração estão implementados. Esta evidência não declara cumprimento integral de todos os TA nem G5/G6/G7 concluídos.

O instalador NSIS por usuário incorpora WebView2 offline, roteiro de teste e avisos de terceiros. Não há updater nem acesso conectado em operação. Sem Authenticode. O instalador precisa ser executado/avaliado no Windows 10 x64 de Amanda; nenhuma instalação no computador-alvo foi simulada ou declarada como realizada.

## Checks executados

- `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm test` e `npm run build`: PASS; dois testes Node de proporção sem arredondamento intermediário e preferência do nome social.
- `cargo fmt --manifest-path src-tauri/Cargo.toml --check`: PASS após formatação.
- `cargo clippy --locked --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings`: PASS após três ajustes de estilo.
- Testes Rust: 12 PASS, com banco temporário e dados fictícios. Cobrem hash/credencial incorreta, CPF, migração inicial/idempotência/FKs/integridade, banco não legível como SQLite simples, rejeição de chave errada, autorização, persistência após reabrir, duplicidade/arquivamento, portabilidade lógica de backup para outra instalação temporária, senha errada e pacote adulterado sem substituição de estado, imutabilidade/versionamento, isolamento/expiração de rascunhos, espera progressiva e auditoria imutável com paginação 50/50/25.
- Cálculos: exemplos técnicos independentes de HB1984, criança, gestante/lactante DRI2023, ajustes -585/+260, meta manual 1.246 com 45/25/30, g/kg e fibras em diabetes. Não equivalem à execução dos 19 fixtures clínicos aprovados, cujas entradas detalhadas ainda precisam ser consolidadas.
- TBCA: composição oficial tem prioridade sobre valores enviados pela interface; código/origem/unidades/valor original preservados. Teste proporção de 55 g de BRC0208A = 75,9 kcal. Micronutrientes ausentes/traços permanecem indisponíveis, não zero.
- Detector da skill impeccable: `[]` (sem achados mecânicos). Não substitui avaliação visual. Tentativa de abrir prévia pela ferramenta de browser falhou na inicialização do sandbox (`apply deny-read ACLs`); nenhum ensaio visual/teclado/ampliação foi declarado.
- Linker MSVC emite LNK4099 pela ausência de PDB do OpenSSL estático. Compilação/testes concluíram; é uma limitação de símbolos de depuração, preservada no log, não tratada como prova de qualidade funcional.

## Rastreabilidade dos módulos reais

| Tarefas / requisitos | Implementação | Evidência atual |
|---|---|---|
| T004/T009; erros e fronteira | `src-tauri/src/lib.rs`, `src/api.ts` | enum de comandos tipados, erro sem detalhes internos; sem SQL genérico ou plugin SQL/FS exposto |
| T010/T017–T020; RF-AUT-001..003 | `security.rs`, `service.rs`; telas em `src/App.tsx` | Argon2, DPAPI CurrentUser, token em memória, atraso progressivo, timeout, monitor de bloqueio Windows; cobertura parcial, reset/timeout/interface ainda requerem ensaio |
| T021/T022; RF-CLI-001/002 | `service.rs`, `App.tsx` | perfil persistido; somente Saúde no incremento |
| T028–T033; RF-PAT-001..006 | `service.rs`, `App.tsx` | CPF, busca normalizada/mascarada, arquivamento/restauração, tags sem exclusão física |
| T039–T042; RF-PRE-001..005 | `nutrition.rs`, `energy.rs`, `service.rs`, `EnergyForm.tsx`, `FoodPicker.tsx` | composição/energia, versões e cancelamento; catálogo parcial TBCA, TACO pendente |
| T046–T048; RF-DRF-001 | `service.rs`, `App.tsx` | aproximadamente 30 s após mudança, antes de navegar/fechar, recuperação autenticada, expiração temporária e remoção ao concluir |
| T011; RF-AUD-001 | `service.rs`, migração 001, `App.tsx` | transações críticas, atores mínimos, triggers imutáveis, UTC semiaberto, filtros AND/cursor congelado; ensaios completos pendentes |
| T012; backup/restauração | `database.rs`, `recovery.rs` | snapshot SQLCipher consistente, pacote AES-GCM+Argon2/checksum, validação, safety backup e importação transacional; credencial DPAPI e estado clínico no mesmo commit |

Consolidação dos caminhos planejados em módulos de fundação e `service.rs` é uma escolha de implementação provisória, reversível, para o primeiro aplicativo. Não muda arquitetura aprovada, requisitos ou autoridade. Separação em unidades menores pode acompanhar os próximos incrementos sem introduzir novas interfaces.

## Pendências para fechar G5/G6

- Completar catálogo/fallback TACO e ensaios de origem, medidas e micronutrientes conforme T038 e TA-PRE-002/004/005.
- Consolidar e executar todos os critérios de aceite, inclusive os exemplos clínicos detalhados; não inferir aprovação de novos valores/entradas.
- Verificar visualmente as telas, teclado, contraste e 200%; medir desempenho com 2.400 pacientes e no hardware-alvo.
- Exercitar reset/troca obrigatória, timeout e Windows bloqueado na interface real; testar instalação, reinstalação, atualização manual e manutenção dos dados no alvo.
- Revisão independente e aceite humano da entrega. G7 permanece sem autorização para dados reais; rotina/mídia externa de backup continua pendente de decisão antes de G7.

As alterações preexistentes do harness/skills/updater foram preservadas. A preparação de assinatura e runner continua adiada. Nenhum segredo foi lido/impresso/copiado para o repositório nesta implementação.

## Artefato verificado

Build NSIS final: PASS (perfil release otimizado, lockfile fixado). Recursos confirmados no script NSIS gerado: WebView2 `offlineInstaller`, `TESTE-LOCAL.md`, `licenses/COMPONENTS.md` e `licenses/THIRD-PARTY-LICENSES.txt`.

- `.artifacts/mvp/2026-10-06/WebFit-Desktop-0.1.0-teste-x64.exe`
- 218.861.647 bytes; SHA256 `648ec6de5465dbb177275acc2ac01b43e49e3e9fc3b1a108d3397a9f9fa40185`.
- Authenticode: `NotSigned`. Instalador não executado nesta máquina nem no alvo.
- `BUILD-MANIFEST.json`: branch, commit-base e hashes das fontes não commitadas. `SHA256.txt` e `COMO-TESTAR.md` acompanham a cópia.
- Árvore final: 12 testes Rust PASS; 2 Node PASS; clippy com `-D warnings` PASS.
- Sem commit/push, PR, release/publicação externa ou alterações remotas. Servidor local de prévia desta tarefa encerrado.
