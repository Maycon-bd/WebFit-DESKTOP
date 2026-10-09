# WEBFIT-10 — Ativação offline e autorizações por instalação

## Refinamento LIGHT — largura do modal, 2026-10-08

Maycon mostrou o modal estreito no piloto 0.1.11-pilot.21.1 e pediu alargar/persistir preferência por reduzir scroll. Base main/3558eddd84211e504ba0457388b1bedc30c9697d, entrada limpa; integração humana do ajuste anterior observada. T-LIC-016/TA-UX-LOGIN-003 reutilizados; sem nova demanda/Plane. Plan inline: LoginInfo agrupado em duas colunas, modal até 960px limitado ao viewport, coluna única até 760px, espaçamentos ajustados e scroll acessível preservado. Sem mudanças de fluxo/backend/dependências.

Implementado em LoginInfo.tsx/style.css. Preferência persistida em AGENTS.md e .harness/prompts/ui-review.md: maximizar conteúdo útil visível, aproveitar largura, preservar legibilidade/teclado, aceitar scroll necessário em telas menores/zoom. Checks PASS: npm run check (lint/TS/27 testes/build), npm run format:check, git diff --check. Aviso de chunk 547.05 kB preservado. Rust/SQLite/build nativo não reexecutados para JSX/CSS; ambiente sem Cargo conforme entrega anterior. Revisão visual nativa/zoom NOT RUN, sem afirmar ausência de scroll em todas as resoluções. Revisão independente estática concluída sem findings acionáveis; ensaio visual nativo permanece pendente. Sem commit/push/publicação.

## Login livre e abertura maximizada — 2026-10-08

Discovery/Plan: Maycon mostrou painel de suporte deslocando o login e pediu movê-lo ao (i), além de iniciar em tela cheia. STANDARD, ajuste de apresentação sem alterar autorização/IPC/schema. Reuso WEBFIT-10; PLANE SYNC DEGRADED (sem ferramenta disponível). Base a520408 na feature/pbi-001-primeiro-incremento-saude, entrada limpa; avanço humano desde 3dc1bd6 preservado. Pedido autoriza implementação; nenhuma publicação/Git mutável novo presumido.

Plan Scope Check: aprovado no escopo. T-LIC-016 move painel de instalação preparada para LoginInfo, mantém ativação inicial, mostra erros no diálogo e bloqueia fechamento durante operação; ícone fixo no canto. T-LIC-017 configura maximized no Tauri, preservando controles Windows. RF-UX-002/RF-LIC-001/TA-UX-LOGIN-003 e RF-UX-005/TA-UX-WINDOW-001. Fonte técnica: https://v2.tauri.app/reference/config/#maximized. Testar callbacks/estrutura do diálogo, checks frontend e config; ensaio nativo separado. Rust/backend sem mudanças; disponibilidade Cargo/build a conferir.

Execução: T-LIC-016/017 implementadas em App/LoginInfo/style/tauri.conf; texto administrativo alinhado ao acesso definido pela licença, sem presumir nome admin. Testes tests/unit/login-info.test.ts exercitam conteúdo/erro dentro do diálogo fechado e proteção de fechamento ocupado/acesso administrativo. PASS: npm run check (lint/TS/24 testes/build), após adição dos testes npm test 26/26, npm run format:check, configuração maximized e git diff --check. Build frontend mantém aviso de chunk 546.84 kB. Dependências existentes restauradas pelo lockfile (DEC-045), nenhum manifesto/lock alterado; cache offline incompleto, npm ci --ignore-scripts autorizado pelo escopo anterior completou com rede ampliada.

Build Tauri tentado diretamente pelo CLI, bloqueado por cargo metadata/program not found; Cargo/Rust não instalado ou disponível no ambiente consultado. Não instalar toolchain nesta entrega. Rust fmt/Clippy/testes SQLite NOT RUN, código Rust/schema não alterados. Ensaio nativo Windows/teclado/foco/200%/reabertura NOT RUN. Impeccable indisponível, revisão estática com padrões existentes; revisão independente em andamento. Base de versão 0.1.10, sem novo instalador/commit/push/publicação nesta mudança.

Code Review final: revisão independente encontrou P2 (falha na consulta inicial mantinha initialized=null e prendia Fechar/Escape). Corrigido separando busy real de adminUnavailable; teste acrescentado. Reavaliação independente sem findings pendentes no escopo estático. npm run check final PASS (lint/TS/27 testes/build 546.88 kB), format:check e diffcheck PASS. REVIEW PASSED WITH WARNINGS na revisão estática; sem READY TO SHIP integrado porque build Tauri e aceite Windows continuam pendentes. Nenhuma mudança de backend/schema/segurança. Documentação RF/TA/matriz e checkpoint atualizados; Plane sync pendente. Próxima ação: build nativo em ambiente com Cargo e ensaio TA-UX-LOGIN-003/TA-UX-WINDOW-001, incluindo falha inicial, suporte, ativação vazia, foco/teclado/200% e reabertura.

## Simplificação aprovada — D-LIC-009, 2026-10-08

### Entrega simplificada concluída localmente

T-LIC-012..015 implementadas/verificadas para candidato de teste; independente/ensaio/aceite pendentes. Retomada após interrupção encontrou branch humana `feature/pbi-001-primeiro-incremento-saude`, HEAD/base `e0fb4eae28b69f69cea74c76771e5ca724c96d2a`, upstream local 0/0; mudanças parciais de protocolo/backend/ADR/requisitos já integradas pelo usuário. Divergência comunicada antes de editar. Nenhuma operação Git mutável, instalação de produto ou publicação pelo agente.

- Protocolo v2 e backend já iniciados foram formatados/completados com testes. UI clínica de seleção de licença/código, fluxo vinculado alternativo em details, emissão inicial no emissor com confirmação/credencial mascarada/código separado e proteção contra outra emissão acidental. Código perdido antes da ativação exige nova emissão; não armazenado em texto claro no repo/pacote.
- Checks PASS: `npm run check` (lint, TS, 24 Node, build); `npm run issuer:build` e ESLint emissor; Prettier frontend/emissor e fmt dos três manifests; Rust/SQLite produto 29 + protocolo 3 + emissor 3; Clippy offline all-targets `-D warnings` nos três; `git diff --check`. Testes de comportamento rodaram antes do ajuste de metadados de versão; código funcional não mudou depois. Builds/Clippy finais verificaram metadados clínico 0.1.10 e emissor 0.1.1. Sem dependências/schema novos.
- Integração SQLite cobre IPC real, código errado sem gravação, falha de trigger com rollback do request/grant, identidade DPAPI preservada, repetição antes/depois do setup, login administrativo, banco preparado/legado preservado e ativação aprovada em segundo destino vazio com identidade distinta. Protocolo cobre root/código errado, adulteração/tipo/v1; emissor cobre confirmação, arquivo existente/rollback e ausência de senha/código no arquivo da licença.
- Build clínico NSIS PASS, após primeira falha de DNS ao obter NSIS. Retry com acesso ampliado autorizado obteve empacotador oficial e instalador offline WebView2, sem executar produto. Runtime offline configurado preservado (não o default downloadBootstrapper). Emissor Tauri debug sem bundle PASS (0.1.1), cofre/identifier preservados; sem abrir cofre real. Warnings conhecidos: PDB OpenSSL, hard links, saída lib/bin, STATIC_VCRUNTIME e chunk Vite >500 KiB.
- Artefatos separados: `.artifacts/mvp/2026-10-08/activation-code-0.1.10/WebFit-Desktop-0.1.10-teste-x64.exe` (222050467 bytes), LEIA-ME-TESTE.md e manifest.json; `.artifacts/mvp/2026-10-08/activation-code-emissor-0.1.1/WebFit-Emissor-0.1.1-teste.exe` e LEIA-ME-ADMIN.md. Manifest contém hashes SHA-256/base/versões, sem código/licença reais. Versão 0.1.10 distingue candidato e supera piloto gerado a partir da base 0.1.8 (0.1.9-pilot), evitando oferecer esse piloto antigo ao candidato.
- Documentação alterada: operação/instalação, regras RN-LIC-001 e rastreabilidade; adendo ADR/RF/TA já integrado no HEAD da retomada e preservado. Fontes de produto: protocolo, teste SQLite, LicensePanel, emissor frontend/backend, manifests/locks de versão. Inventário completo no diff e neste registro.

EXECUTION COMPLETE. Code Review local: inspeção de assinatura/versionamento/limites, associação autenticada à identidade local/transação, acesso definido no emissor e recursos NSIS (binário clínico, runtime e três avisos/documentos; sem emissor/cofre). Autorrevisão não equivale a independente; UI inspecionada estaticamente, sem ensaio de teclado/visual no WebView ou instalação executada. Sem finding bloqueador novo identificado; não declarar REVIEW PASSED/READY TO SHIP/Done. Plane sync degraded nesta retomada; nenhum estado remoto inferido.

Conferência final PASS: hashes dos dois artefatos comparados ao manifest, versões package/lock/config consistentes, NSIS efetivo `offlineInstaller`, `git diff --check` e base/upstream local preservados. Authenticode dos dois executáveis: `NotSigned`; não confundir assinatura criptográfica da licença com assinatura Windows/release. Primeiro comando de leitura do package-lock em PowerShell falhou por propriedade JSON de nome vazio; validação repetida com `-AsHashtable` passou, sem alteração do arquivo. Inspeção/checks locais concluídos; review independente e ensaio humano permanecem NOT RUN.

Próxima ação: Maycon abrir emissor atualizado no mesmo usuário Windows do cofre, definir/guardar acesso administrativo no Bitwarden, gerar licença+código e enviar junto do instalador para ensaio fictício em destino vazio. Não pedir senha/código no chat nem enviar emissor/cofre/backup privado. Ainda requer review independente/aceite e gates aplicáveis para uso real. Limite offline D-LIC-009 preservado.

Maycon pediu implementar antes de enviar instalador à nutricionista e respondeu: “Sim, aceito esse limite e quero o fluxo offline simplificado”. ACCEPTED / Validated by Human: enviar instalador, licença e código juntos, sem request inicial/serviço online; pacote pode ativar mais de um computador. Consumo local não é uso único global. Credencial administrativa pertence à licença e é a mesma em cópias desse pacote; senha administrativa não acompanha pacote. Painel/serviço online adiados; somente dados fictícios.

Plan aprovado no escopo: estender RF-LIC-001 com envelope INITIAL portátil v2, assinatura Ed25519/sealed box existentes, cifrado para chave aleatória entregue como código `WF1-` + base64 de 32 bytes. Emissor gera licença/código sem request; clínico confere confiança/assinatura/código e permite somente INITIAL em destino vazio. Grant verificado é associado à identidade local em transação, sem substituir DPAPI. V1 e quatro operações posteriores mantêm vínculo. Sem dependência/schema novos. T-LIC-012 protocolo/testes; T-LIC-013 emissor; T-LIC-014 IPC/UI/transação/testes SQLite; T-LIC-015 checks/builds clínico NSIS e emissor/documentação/evidência. Critérios TA-LIC-013..016. Código/licença reais gerados por Maycon na ferramenta; não acessar cofre real/solicitar senha em chat. Sem Git/publicação/instalação no host. Review independente/ensaio/aceite pendentes. Plane sync degraded (ferramenta de item indisponível); WEBFIT-10 preservado.

## Preparação do candidato configurado — 2026-10-08

Maycon abriu o emissor e enviou captura com “Configuração pública exportada”, depois informou `C:\Users\Maycon Garcia Silva\Downloads\chave-publica-webfit.json`. Validação local confirmou array JSON com uma chave pública base64 de 32 bytes, idêntica à configuração já presente em `src-tauri/license-trust.json`; nenhuma sobrescrita necessária. Não foram acessados senha, chave privada, cofre ou backup. Exportação/backup do cofre não foram verificados diretamente; não inferir backup concluído.

`npm run tauri build -- --no-bundle -- --locked` PASS, incluindo TypeScript/Vite e release Windows (Cargo 2m06s); warnings conhecidos de chunk >500 KiB, PDB OpenSSL, colisão lib/bin e STATIC_VCRUNTIME. Executável copiado, sem instalar/abrir o produto, para `.artifacts/licensing-test/2026-10-08/WebFit-ativacao-configurada-0.1.8.exe`. Este candidato contém a árvore integrada local, incluindo alterações preexistentes; não atribuir seu conteúdo inteiro à WEBFIT-10. Esta etapa não altera lógica/schema/dependências nem banco instalado. Checks anteriores de comportamento são reutilizados; a compilação não comprova ativação real.

Branch/base `main`/`680fad5616d54a895dbecc6702595a1b5d232cfd`, upstream local 0/0 sem fetch; trabalho paralelo preservado. Próxima ação: ensaio humano da ativação inicial em outro usuário Windows/VM/computador vazio, com dados fictícios, e revisão independente. Mesmo identifier no mesmo usuário reutiliza o banco instalado; não substituir piloto, apagar banco ou desinstalar para este ensaio. Sem NSIS, publicação, licença real emitida pelo agente, aceite final ou READY TO SHIP. Registros abaixo de confiança vazia descrevem a compilação anterior.

Maycon escolheu explicitamente **outro computador ou máquina virtual** para o ensaio. Orientação: copiar somente o candidato clínico para o destino vazio; gerar `.webfit-request`, trazer ao computador do emissor e emitir localmente. Emissor/cofre/backup privado permanecem no computador administrativo. SHA-256 do candidato: `22A7AD2F8E4DA966786086734098BCA924687609138A8C47873F1C7ECA248AD1`. `git diff --check` dos dois registros PASS. Ensaio de ativação ainda NOT RUN; revisão independente pendente.

## Aprovação e execução vigente — 2026-10-08

Maycon: **“Aprovo a implementação”**, após o pacote técnico e as perguntas D-LIC-006..008. ACCEPTED: ADR-0003 v1, duas dependências novas, migração 002, emissor separado, senha de suporte distinta, preservação de acessos do destino em restore e modo legado restrito a backup/solicitação. P-LIC-001 aceita no mesmo inventário. PLAN APPROVED BY SCOPE; execução local concluída e encaminhada a Code Review/Plane Review, com review independente/visual/aceite pendentes. Texto abaixo conserva a história do planejamento; pendências de adoção foram resolvidas por esta aprovação. Não autoriza dados reais, Git ou publicação. Review independente e ensaio Windows continuam pendentes.

## Entrega local e evidência vigente — 2026-10-08

**EXECUTION COMPLETE. Code Review: autorrevisão/checks concluídos; revisão independente e ensaio visual NOT RUN, sem REVIEW PASSED/READY TO SHIP.** Plane encaminhado a Review; aceite final humano pendente. Branch main, HEAD/base 680fad5616d54a895dbecc6702595a1b5d232cfd, upstream local 0/0, sem fetch/pull/Git mutável/publicação. Chave real de emissão/confiança não provisionada pelo agente. O histórico de Plan abaixo permanece como evidência anterior, não como pendência vigente.

### Implementado / inventário

- T-LIC-002 concluída: D-LIC-006..008/P-LIC-001 ACCEPTED por aprovação específica; ADR aceito, requisitos/regras/casos/matriz/segurança/operação/checkpoint atualizados.
- T-LIC-003/005: `crates/license-protocol/{Cargo.toml,Cargo.lock,src/lib.rs}`, `src-tauri/{Cargo.toml,Cargo.lock,license-trust.json,migrations/002_license.sql}`, `src-tauri/src/{license.rs,license_tests.rs,database.rs,service.rs,lib.rs}`. Ed25519 strict, sealed box por X25519, framing binário com domínio e comprimentos dos campos/ciphertext (sem reserialização de JSON para assinatura), tipos fechados/deny_unknown_fields, limite 64 KiB/PHC fixo, request/challenge/destino/base conferidos. Identidade DPAPI fora do DB; payload pendente DPAPI; consumo/auditoria/efeitos transacionais.
- T-LIC-004: `tools/license-issuer/{README.md,index.html,vite.config.ts,tsconfig.json,src/main.tsx,src-tauri/**}` (manifests/lock/build/config/capability/main/vault/migration 001); `scripts/license-issuer.mjs` e scripts npm em `package.json`. Cofre separado SQLCipher/DPAPI, senha aleatória mascarada por padrão, confirmação de destinatário/tipo, licença para arquivo novo, export público e backup AES-GCM/Argon2; import validado/confirmação/cópia anterior protegida. Nenhum comando de emissão ou private key global no IPC clínico.
- T-LIC-006/007: `recovery.rs`, testes existentes `tests.rs`/`acceptance_tests.rs` preparados com licenças reais de fixture (sem bypass de autorização). Backup reflete schema real e fornece checksum; staging v1/v2/integridade, linhagem/grant de transferência, destino vazio sem backup impossível, colunas explícitas/allowlist; não copia licença/consumo/credenciais/settings de login da origem. Autores antigos inativos sem PHC utilizável; restauração comum mantém credenciais do destino. Legado autentica para backup; clínica bloqueada e banco preservado.
- T-LIC-008/009: senha separada de suporte, consumo no login bem-sucedido, deadline Instant de quatro horas que Touch não estende, encerramento ao sair/bloquear/inatividade/reinício; ações de suporte identificadas na auditoria. Recuperação administrativa encerra sessão sem apagar dados. Reset ADMIN exige grant, confirmação e snapshot validado; mantém perfil/rascunho de perfil, acessos/licença/auditoria/backups/consumo. Limpeza somente de inventário clínico aprovado.
- Frontend: `src/{LicensePanel.tsx,App.tsx,style.css}`; aguardo/solicitação/importação/operações/repetição/carregamento/erro, setup sem campo admin_password, legado com backup; teclado/rótulos/roles inspecionados estaticamente. Foco das novas superfícies com contraste calculado 8,25:1 em branco e 7,60:1 no fundo existente.
- `.gitignore`: artefatos de licença/solicitação/backup de emissor/DPAPI e schemas gerados do emissor excluídos; sem banco/chave real no repo. Trabalho preexistente WEBFIT-8 (branding/Cargo/lib/evidence), WEBFIT-11 e demais trilhas preservado.
- T-LIC-010 continua **adiada por Maycon**; pacote de suporte por cópia não implementado. T-LIC-011: checks/autorrevisão/evidência concluídos; parte independente/aceite pendente.

### Checks executados (Windows, fixtures, 2026-10-08)

| Check / comando | Resultado / limite |
|---|---|
| `npm run check` | PASS: ESLint, TypeScript, 18 Node, build Vite. Build/frontend final refeito após último ajuste de foco |
| `npm run issuer:build`; ESLint do emissor | PASS: TS, frontend separado e lint |
| `npm run format:check`; Prettier do emissor/scripts; `cargo fmt -- --check` nos três manifests | PASS |
| `cargo test --manifest-path src-tauri/Cargo.toml --offline` | PASS 28, inclui nove cenários novos de licença com SQLite/SQLCipher/DPAPI. Ampliação final do cenário reset (perfil/rascunho/auditoria) revalidada isoladamente |
| `cargo test --manifest-path crates/license-protocol/Cargo.toml --offline` | PASS 2: assinatura/root/destino/tipo/adulteração/limites/PHC |
| `cargo test --manifest-path tools/license-issuer/src-tauri/Cargo.toml --offline` | PASS 2: emissão, repetição, ausência de senha no artefato, cofre recuperável, senha errada/tamper preservando identidade |
| `cargo clippy --offline --all-targets -- -D warnings` nos três manifests | PASS; cópia em vez de hard link é warning ambiental do cache |
| `npm run tauri build -- --no-bundle -- --locked` | PASS Windows release clínico 0.1.8, sem instalar/gerar NSIS/publicar; confiança pública vazia exige provisionamento humano |
| `npm run issuer:tauri -- build --no-bundle --debug -- --locked` | PASS executável Windows separado com frontend embutido, **debug**, sem instalação/distribuição/release otimizada do emissor |
| `git diff --check`; validação de 85 links locais; inspeção dos bundles JS | PASS; sem marcador de senha fictícia nos dois bundles; clínico sem `issuer_operate`/`admin_password`. Inspeção não é prova absoluta de ausência de secrets |
| Impeccable detector nas quatro superfícies, antes do ajuste final de foco | Sem findings mecânicos; contraste de foco calculado separadamente; inspeção estática não aprova visual/teclado real |
| Browser/IAB da fixture local | NOT RUN: timeout ao anexar webview. Servidor de prévia encerrado; nenhum ensaio visual inferido |
| Review independente, NSIS/update/instalação visual, dados reais/G6/G7 | NOT RUN / não autorizado por esta entrega; sem READY TO SHIP ou Done |

Ambiente: TEMP/TMP dos testes em `.artifacts/licensing-tests`; Perl portátil existente usado em SQLCipher. Primeiro download Cargo recusou DNS no sandbox, depois execução ampliada autorizada baixou somente dependências aprovadas. Primeiro check do emissor revelou Perl ausente no PATH e depois referência de ícone ausente, ambos corrigidos reutilizando ferramentas/ícone existentes. OpenSSL do emissor compilou uma vez (~11 min); sem instalar novo toolchain. Warnings residuais: PDB do OpenSSL ausente, hard links de cache, STATIC_VCRUNTIME deprecated, nomes de saída lib/bin coincidentes no Cargo existente e chunk Vite clínico >500 KiB. Não impediram checks/builds; sem refatoração adjacente para silenciá-los. Mensagens SQLCipher de HMAC são do teste de chave inválida, sem dados clínicos/segredos.

### Code Review e próxima ação

Passagem separada sobre diff/contratos/backend/SQLite/cripto/UI, sem revisor independente autorizado nesta execução. Corrigidos e revalidados: preparação administrativa livre, restauração de senha antiga/consumo da origem, backup impossível em destino vazio, assinatura não canônica/reimportação consumida, distinção de auditoria de suporte e contraste de foco das novas telas. Segurança: validação backend/SQL parametrizado/consumo e efeitos no mesmo tx/limites de entrada/nenhum segredo global no clínico. **Autorrevisão não equivale a review independente.** Sem finding funcional bloqueador remanescente identificado nesta passagem; análise não é pentest/auditoria externa nem garantia contra clone/rollback.

Próxima ação exata: Maycon revisar a entrega/obter revisor independente e ensaiar os cinco fluxos no Windows com fixtures. Em sua ferramenta, criar identidade real e backup protegido; exportar/integrar **somente a chave pública** em `src-tauri/license-trust.json` pelo seu fluxo Git/build e gerar candidato configurado. Não distribuir o candidato de confiança vazia nem substituir piloto instalado por este build 0.1.8. Credenciais exclusivas podem ficar em Login/nota segura Bitwarden, manualmente. Depois aceite humano e gates de distribuição/dados reais aplicáveis; nenhuma aprovação repetida de D-LIC-001..008. Sem publicar, instalar, abrir cofre real, copiar banco real ou alterar Git automaticamente.

## Histórico preservado — Discovery e Plan anteriores à aprovação

- Data: 2026-10-08. Nível: STRICT. Responsável técnico/PO: Maycon.
- Branch: `main`; HEAD da retomada: `680fad5616d54a895dbecc6702595a1b5d232cfd`; base histórica da criação: `e07cdc8300de0421dbdc7fd64aafe7d30a191e80`.
- Plane: `119b1627-dd4a-4a4f-b015-64ee60183afb`, WEBFIT-10, módulo Fundação, **Decision Review** para D-LIC-006..008; prioridade neutra, sem prazo inventado.
- Entrada: invocação explícita de webfit-task e anotações de Maycon nesta conversa. Autoriza iniciar demanda e registrar escolhas; não equivale a aceite de detalhes ainda indefinidos.
- Fase: Plan técnico detalhado, **PLAN REQUIRES HUMAN DECISION** para contratos/dependências/schema específicos; Discovery já válida preservada. Primeira atividade pendente: resposta a D-LIC-006..008.
- Fontes: [decisão](../../docs/project/decision-log.md#dec-058--ativação-offline-e-autorizações-por-instalação), [requisitos](../../docs/requirements/functional-requirements.md#licenciamento-offline--webfit-10), [regras](../../docs/requirements/business-rules.md#licenciamento-offline--webfit-10), [aceite](../../docs/requirements/acceptance-criteria.md#licenciamento-offline--webfit-10), [ADR proposto](../../docs/architecture/adr/ADR-0003-ativacao-offline-e-suporte.md).

## 1. Discovery

### Problema e evidência atual

O instalador não leva a conta do computador de Maycon. `Service::Setup` em `src-tauri/src/service.rs` permite cadastrar ADMIN e NUTRITIONIST somente se `users` estiver vazio. Porém qualquer pessoa com a instalação vazia pode escolher o administrador. `SetupForm` em `src/App.tsx` predefine `admin`, mas recebe a senha localmente. Não há licença nem emissor.

`src-tauri/src/lib.rs` abre armazenamento por perfil Windows; `service.rs` cria chave aleatória protegida por DPAPI e abre `health.db` com SQLCipher. `security.rs` usa Argon2 para senhas. `recovery.rs` cria snapshot consistente e pacote `.webfit-backup` criptografado, recuperável por senha. Restauração importa usuários/credenciais e não valida licenciamento. Portanto licença administrativa não permite, por si só, abrir o `.db` em outro computador.

Uma instalação nova criada por terceiro não dá acesso automático ao banco existente da nutricionista. O objetivo é controlar quem prepara instalações e assegurar uma conta administrativa de Maycon em cada instalação autorizada.

### Aprovações demonstradas

- A-LIC-001, ACCEPTED por Maycon: instalação aguarda ativação → gera solicitação → envio manual a Maycon → emissão de licença vinculada e definição das credenciais administrativas → importação/validação → preparação dos acessos.
- A-LIC-002, ACCEPTED por Maycon: cinco tipos de autorização — ativação inicial, transferência/recuperação, suporte temporário, recuperação administrativa e reinicialização. Ativação inicial recusa banco preparado; reinicialização exige backup e confirmação separada.
- A-LIC-003: Maycon perguntou sobre anotações do Bitwarden. Notas seguras e itens Login são opções de custódia humana; recomenda-se um Login por instalação, com senha no campo próprio e IDs/notas sem dados clínicos. Nenhuma integração Bitwarden ou gravação no cofre foi solicitada.
- Não transportar senha mestra/segredo de emissão no instalador. Proposta técnica: login e verificador Argon2 por instalação em autorização assinada; proteção adicional do verificador por criptografia destinada à instalação será avaliada no ADR. Não há autorização para colocar senha recuperável em licença.

### Escopo e restrições

RF-LIC-001..005; TA-LIC-001..011. RF-LIC-006/TA-LIC-012 adiados para outra demanda por Maycon. Prioridade humana não definida. Os cinco tipos têm intenção aprovada; detalhes técnicos pendentes não são apresentados como aprovados. Produto continua offline, Windows-first e sem servidor/mensalidade; assinatura de licença separada da assinatura do updater. Nutricionista e administrador continuam com acesso total no espaço Saúde; nenhum novo papel clínico ou redução de acesso é inferido.

Solicitação não contém dados clínicos/CPF/senha. Emissão é exclusiva de Maycon; instalador da nutricionista não distribui emissor nem chave privada. Atualizar/reparar não reativa nem apaga. Reimportar autorização consumida não repete efeitos. Vínculo offline impede uso em instalação distinta, mas não promete consumo global, revogação remota, resistência absoluta a clones/rollback ou a administrador do Windows alterando o programa.

Pacote de suporte criptografado (RF-LIC-006) foi **adiado para outra demanda** por Maycon, distinto da autorização de sessão administrativa desta entrega. Registro da ideia preservado sem criar novo Work Item ou implementar/exportar dados. Devolver banco completo pode perder trabalho posterior ao snapshot; sua regra ficará na demanda futura.

### Decisões materiais pendentes

| ID | Estado | Decisão necessária / recomendação | Operação dependente |
|---|---|---|---|
| D-LIC-001 | ACCEPTED | Maycon informou que tudo anterior era teste: entrega parte de ativações iniciais. Sem migração clínica ativa; banco de teste preparado não é apagado automaticamente | Definição de entrega inicial, não aprovação de uso real |
| D-LIC-002 | ACCEPTED | Emissor local separado com interface, escolhido por Maycon. Custódia/recuperação continuam no desenho técnico | Formato da ferramenta definido |
| D-LIC-003 | ACCEPTED | Uma sessão de até 4 h, encerrada também ao sair/bloquear, escolhido por Maycon | Duração definida; protocolo/consumo pendentes |
| D-LIC-004 | ACCEPTED | Manter licença/acessos e limpar dados do consultório; backup e confirmação separados, consumo preservado. Escolha explícita de Maycon | Resultado funcional da reinicialização definido; execução só em fixture autorizada |
| D-LIC-005 | ACCEPTED | Pacote protegido para suporte fica para outra demanda, escolha explícita de Maycon | RF-LIC-006/TA-LIC-012 adiados, fora desta execução |

Validated by: Human (Maycon), D-LIC-001..005 em 2026-10-08, respostas explícitas. Nenhuma dessas perguntas deve ser repetida. Detalhamento técnico ainda necessário: identidade em restauração, perda/rotação da chave de emissão, recuperação administrativa e inventário dos dados de consultório na reinicialização. Não criar requisitos legais ou clínicos por inferência.

Resultado: DISCOVERY COMPLETE para o início funcional solicitado; Plan técnico em elaboração. Fluxo/tipos/entrega inicial/emissor/duração/reinicialização/escopo do pacote definidos. Contratos técnicos de risco ainda exigem detalhamento, sem gate genérico criado.

## 2. Plan técnico — continuação de 2026-10-08

Reentrada somente leitura confirmou main/HEAD 680fad5 e upstream local 0/0. Mudança humana em relação a e07cdc8 informada antes de editar; alterações locais de `docs/project/status.md` e `specs/WEBFIT-11/task.md` preservadas. Fontes/gates reavaliados, código ainda sem licenciamento; restore posicional genérico de users/settings confirmado como fronteira crítica.

**Proposta concreta:** [ADR-0003, proposta técnica v1](../../docs/architecture/adr/ADR-0003-ativacao-offline-e-suporte.md#proposta-técnica-v1--2026-10-08). Dois aplicativos Tauri separados, módulo Rust de protocolo comum, assinatura Ed25519 e sealed box para cada destinatário. Licença contém login/verificador Argon2 cifrado, sem senha recuperável. Trust root pública por build; private key somente no cofre do emissor, com backup portátil protegido. Produto não tem comandos de emissão ou chave privada global. Nenhuma dependência instalada/manifest alterado.

### Decisões específicas de adoção

| ID | Estado | Proposta e impacto | Por que exige resposta |
|---|---|---|---|
| D-LIC-006 | NEEDS-HUMAN-DECISION | Adotar protocolo/custódia do ADR v1, duas crates diretas ed25519-dalek 2.2.0 e crypto_box 0.9.1, schema 002 aditivo, emissor separado e senha temporária de suporte distinta da permanente | Dependências/schema/arquitetura e nova regra de autenticação sensíveis; DEC-058 não aprovou estes detalhes |
| D-LIC-007 | NEEDS-HUMAN-DECISION | Restore preserva contas/senhas atuais do destino; autoria/auditoria importa usuários históricos inativos, sem login; transferência define acessos do novo destino. Alternativa: restaurar credencial da nutricionista da origem, mantendo administrador do destino | Muda comportamento anterior de restore que importava credenciais; não decidir silenciosamente |
| D-LIC-008 | NEEDS-HUMAN-DECISION | Banco de teste preparado sem licença conserva dados e oferece autenticação só para backup/solicitação; uso clínico requer destino vazio licenciado. Alternativa: manter uso antigo de teste até preparação manual de nova instalação | Regra de transição não foi definida por dizer que tudo era teste; bloqueio de uso é comportamento percebido |

Perguntas D-LIC-006..008 enviadas em conjunto por ferramenta assíncrona após proposta/documentação/resumo de Plan. Sem resposta registrada ainda; opção preselecionada/silêncio não aprova. Autorização técnica proposta inclui preservar profile/auditoria/backups na reinicialização, somente fixtures fictícias, sem Git/publicação.

Detalhe conservador P-LIC-001, **AGENT-PROVISIONAL**: reinicialização preserva perfil profissional/rascunho de profile e catálogo, além de licença/acessos/auditoria/backups, limpando patients/prescriptions/tags/patient_tags e drafts clínicos. Confiança alta, impacto reversível no plano, sem apagar cadastro profissional não explicitamente pedido; nenhum DELETE executado. Confirmar inventário no lote técnico antes de implementação destrutiva.

### Contratos e componentes

- `crates/license-protocol/`: tipos fechados, bytes assinados/versionados, assinatura estrita/secret payload cifrado, limites de entrada e validação PHC; dependências novas só após autorização.
- `src-tauri/src/license.rs` e `service.rs`: solicitações/importação/consumo no backend, operador admin autorizado, session/grant para suporte, ausência de bypass IPC. Identidade X25519 DPAPI fora do banco; nenhuma chave privada clínica importada do backup.
- `src-tauri/migrations/002_license.sql` e `database.rs`: três tabelas license_state/requests/authorizations, versão 2, constraints/FKs/consumo e efeitos numa transação; versão 1 atual permanece inalterada até aprovação.
- `recovery.rs`: staging schema 1/2, importação de colunas explícitas; excluir estado/consumo/licença da origem; suportar destino ainda vazio sem depender de recovery_salt/recovery_wrapped ausentes; preservar chave clínica do destino e exigir linhagem/grant correto.
- `src/api.ts`, `src/App.tsx` e componentes de ativação: aguardo/gerar solicitação/importar/preparar; senha admin ausente no setup clínico; mensagens reais de rejeição, teclado/foco e recuperação. Opções administrativas exigem sessão/grant/capacidade conforme contrato, não esconder botão como controle.
- `tools/license-issuer/`: frontend próprio reutilizando versões React/Vite/Tauri locais e Rust próprio, identifier/storage separados; selecionar solicitação/conferir ID/tipo/emitir/salvar; senha mostrada somente à ação de Maycon em campo mascarado. Cofre SQLCipher/DPAPI e export/import AES-GCM/Argon2; sem build/publish no pipeline clínico ou segredo em resource. Chave pública exportada é configuração pública para integração humana posterior.

Plano deve ser executado em incrementos verticais na ordem abaixo, com fronteira de autorização verificada antes do primeiro manifest/schema.

### Abordagem e impacto esperado (ainda sem execução de produto)

1. T-LIC-001: registrar aprovações, requisitos/aceite, ADR proposto e decisões materiais. **Concluído documentalmente nesta sessão.**
2. T-LIC-002: proposta técnica concluída/documentada e APIs oficiais verificadas; incorporar D-LIC-006..008 e aceitar ADR somente com evidência humana suficiente. D-LIC-001..005 não se repetem.
3. T-LIC-003: implementar fronteira Rust de solicitação/importação/assinatura/vínculo/consumo; manter IPC tipado, erros seguros, autorização no backend e auditoria sem payloads sensíveis.
4. T-LIC-004: implementar emissor separado; chave privada fora do repo/frontend/instalador clínico; definir salvamento dos artefatos e orientação Bitwarden sem integração externa.
5. T-LIC-005: incremento vertical de ativação inicial e credenciais; UI de aguardo/solicitação/importação/preparação, persistência transacional e testes observáveis.
6. T-LIC-006: compatibilidade não destrutiva de bancos de teste e interação com atualização, backup/restauração e consumo das autorizações; entrega inicial em instalação vazia. Avaliar migração numerada/banco vazio/versão anterior antes de alterar schema.
7. T-LIC-007: transferência/recuperação e recuperação administrativa, preservando dados e identidade correta do destino.
8. T-LIC-008: suporte temporário conforme regra decidida; relógio controlado em testes e limite explícito contra manipulação do relógio/rollback offline.
9. T-LIC-009: reinicialização somente após desenho/autoridade suficientes, backup validado, confirmação e teste de falha/recuperação. A autorização de tipo não autoriza apagar banco real nesta sessão.
10. T-LIC-010: **adiada para outra demanda**, por D-LIC-005: pacote de suporte isolado e política de retorno. Não executar neste escopo.
11. T-LIC-011: sincronizar documentação, executar checks do produto afetado e review independente com evidência; dados fictícios, sem Git/publicação automáticos.

Arquivos previstos detalhados acima; manifests Cargo/locks do produto, protocolo e emissor mudam somente após D-LIC-006. Nenhuma dependência npm nova; sem reorganização geral em workspace Cargo ou reutilização do spike G4. Scripts de checks/build do emissor entram no mesmo escopo autorizado, com bundle separado e sem publicação automática.

### Verificação planejada

- TA-LIC-001..005: SQLite real; assinatura/root/destino/tipo/request adulterados, versão inválida, entrada/PHC excessivos, IPC direto, concorrência/repetição/interrupção; sem segredo no bundle/logs. TA-LIC-005 cobre também cofre de emissor, export/import protegido, senha incorreta/arquivo adulterado e release sem trust root de fixture.
- TA-LIC-006..009: backup/restauração de destino fictício, sessão de suporte com relógio controlado, recuperação administrativa e reinicialização cancelada/falha de backup preservando dados.
- TA-LIC-010/011: ensaio Windows de atualização/legado e teclado/foco/carregamento/erro/repetição. TA-LIC-012 adiado com o pacote de suporte.
- Formatação, lint, TypeScript, frontend, Rust/SQLite e build Tauri conforme DoD quando houver código. Neste início documental: links, IDs/rastreabilidade, consistência de status e diff.

Scope Check: proposta técnica/custódia/recuperação/migração concreta e verificável no ADR; D-LIC-001..005 resolvidas. **PLAN REQUIRES HUMAN DECISION** exclusivamente D-LIC-006..008 (novas dependências/schema/autenticação e restore/transição); bloqueia manifest/migração/código sensível dependentes. Pesquisa/documentação/checks permitidos concluídos; não há gate genérico do fluxo já aprovado. ADR proposto, sem aceite por inferência; G5 em execução/G6/G7 não concluídos, sem dados reais. Critérios técnicos adicionais de risco são propostos, não testes executados.

## 3. Execution

Registro documental iniciado; produto, banco, credenciais, instalador e dependências não alterados por WEBFIT-10. Testes de comportamento ainda NOT RUN. Não confundir critérios registrados com implementados/verificados.

## 4. Code Review / evidência do início

Autorrevisão documental: fonte humana identificada, comportamento aprovado separado de lacunas; nenhuma promessa de consumo global offline ou revogação remota. Review independente ainda NOT RUN; não declarar READY TO SHIP.

Checks: `git diff --check -- docs .harness/knowledge/DECISIONS-REGISTER.md` PASS; PowerShell: 109 links locais e 5 âncoras novas PASS, caracteres invisíveis/whitespace dos dois arquivos novos PASS, definições dos 32 IDs RF/RN/TA/UC-LIC PASS (inclui registros adiados). Fonte/status revisados manualmente. Produto/formatação TS/lint/testes frontend/Rust/SQLite/build: N/A neste início documental; comportamento de licença NOT RUN. Não comprova aceite/review independente.

Plane: busca dos nove itens do projeto sem correspondente; criado um WEBFIT-10, associado a Fundação; Decision Review durante esclarecimento, retorno a Planning após D-LIC-004/005. Prioridade neutra/módulo preservados; nenhuma outra demanda alterada. Limites: nenhuma licença real emitida, banco aberto/copiado/restaurado, senha solicitada ou instalador exercitado. Alterações preexistentes do harness/WEBFIT-6/7/8/9 preservadas. Git/publicação sob Maycon.

Continuação desta sessão: Plan técnico/ADR modificados e cruzados com SQLite/restore/session reais. Avaliação estática de arquitetura identificou e tratou no plano: trust root autodeclarada em licença, sealed box sem autenticidade de emissor, consumo ressuscitado por restore, backup pré-restore impossível no destino vazio e importação de ADMIN da origem. Não afirmar correções de produto: são controles planejados. Dependências/manifests/schema/produto não alterados.

Checks desta continuação: PowerShell verificou 95 links locais nos nove owners, duas referências à nova âncora e ausência de caracteres invisíveis: PASS. `git diff --check` com os nove paths: PASS. Revisão do diff preservou alterações WEBFIT-11; status final só documentos, HEAD 680fad5/branch main. APIs de bibliotecas/Tauri lidas em fontes primárias; consulta RustSec limitada documentada no ADR. Testes de produto/compilação/cripto/UI NOT RUN, pois nada disso foi implementado; review independente ainda NOT RUN. Plane update/readback confirma Decision Review/Fundação/prioridade neutra para as três decisões específicas. Não READY TO SHIP.

Próxima ação: respostas a D-LIC-006..008, incorporar no registro/ADR/requisitos e avançar automaticamente à execução aderente; nunca repetir D-LIC-001..005. Validar biblioteca/lock/MSRV na compilação autorizada; revisão independente/Windows/aceite final permanecem pendentes. Sem Git/publicação.
