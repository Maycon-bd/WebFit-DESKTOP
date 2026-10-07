# RF-UX-001 — tour guiado do MVP, 2026-10-06

## Escopo e autorização

Maycon pediu tutoriais no primeiro acesso às telas, com indicativos e Pular para aprender durante o uso. DEC-046 registra o refinamento da execução G5 já autorizada por DEC-045. A mesma branch de feature e o trabalho anterior foram preservados; nenhuma operação Plane/GitHub foi realizada. Não representa aceite G5/G6/G7.

## Entrega

Oito tours com 2–4 passos: pacientes, novo cadastro, cadastro existente, perfil, prescrição, auditoria, backup e acesso. Indicativos junto aos controles reais, contagem de passos, Próximo/Voltar/Concluir/Pular e repetição em Ver tutorial. Escape encerra o tour, foco segue o passo, balões reposicionam ao rolar/redimensionar; interface subjacente permanece utilizável. Login/preparação mantêm instruções inline; senha temporária deve ser trocada antes dos tours.

Preferências isoladas por usuário na tabela settings criptografada existente: comandos autenticados TourState/CompleteTour, catálogo fechado TourId, chave versionada v1. Somente o ID do tutorial é guardado, sem campos clínicos. Conclusão e pulo têm o mesmo efeito de lembrar a visita; replay continua disponível. Não altera schema, recuperação ou cadastros. Erros de persistência são apresentados sem bloquear o trabalho. Nenhuma dependência adicionada.

Detalhamento reversível de persistência/replay é AGENT-PROVISIONAL, distinto da aprovação explícita do tutorial/Pular. Código: src/GuidedTour.tsx, src/onboarding.ts, src/App.tsx, src/EnergyForm.tsx, src/style.css e src-tauri/src/service.rs. Rastreabilidade: Specification RF-UX-001, Plan, Tasks T084–T087 e docs/requirements/traceability.md.

## Verificação

- npm run check: lint, TypeScript, 4 testes Node e build frontend PASS.
- npm run format:check e cargo fmt --check: PASS.
- cargo test --locked: 13 testes Rust PASS, inclusive persistência por usuário após reabertura, autenticação, catálogo fechado e schema em versão 1.
- cargo clippy --locked --all-targets -- -D warnings: PASS.
- Impeccable detect --json nos arquivos UI: nenhuma ocorrência ([]).
- git diff --check: PASS (avisos preexistentes de conversão LF/CRLF).
- Automação visual indisponível: navegador não iniciou, `windows sandbox failed: helper_unknown_error: apply deny-read ACLs`. Não houve instalação, execução nativa ou inspeção visual; T087 registra o ensaio Windows 10 x64 pendente, inclusive teclado, zoom, skip/replay e atualização sobre 0.1.0.

## Empacotamento

Versão 0.1.1 em npm/Cargo/Tauri, schema preservado. Instalador NSIS currentUser x64 com WebView2 offline, roteiro atualizado e licenças. Candidato 0.1.0 preservado; build concluído com exit code 0; cópia nova e hashes registrados abaixo. Avisos de empacotamento: colisão de nomes PDB bin/lib, STATIC_VCRUNTIME deprecado e LNK4099 OpenSSL sem símbolos; não são falhas de compilação, clippy dos fontes passou.

## Limites

Teste somente com dados fictícios. Pendências clínicas/catálogo/TACO/desempenho, revisão independente e aceite completo do incremento continuam na evidência 2026-10-06-candidate.md. Sem commit/push/PR/release, publicação externa ou updater. Próxima ação: testar instalador e tours segundo docs/operations/mvp-local-test.md.


## Artefato verificado

- .artifacts/mvp/2026-10-06/onboarding-0.1.1/WebFit-Desktop-0.1.1-teste-x64.exe
- 218.874.042 bytes; SHA256 `4db9e2fb34094e2265e33640357854b25de4c647c4c4c79821b735442f1efc93`.
- Authenticode NotSigned; não instalado ou executado neste host. BUILD-MANIFEST.json, SHA256.txt e COMO-TESTAR.md na mesma pasta. Artefato 0.1.0 preservado.
- Branch feature/pbi-001-primeiro-incremento-saude; HEAD/commit-base 66f886fe2be407803298918c08798af6791fffda, upstream local sem ahead/behind indicado. Fontes não commitadas, trabalho preexistente preservado. Nenhum fetch, commit ou push.
