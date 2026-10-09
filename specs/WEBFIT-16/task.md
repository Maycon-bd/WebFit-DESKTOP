# WEBFIT-16 — Painel administrativo integrado

Data: 2026-10-09. Nível: STRICT. Responsável: Maycon.
Plane: `d5900571-6c1b-47db-b898-0b9f82a461bd`, Review, Fundação, prioridade neutra. Sem Done antes do aceite humano.
Branch: `feature/pbi-001-primeiro-incremento-saude`. HEAD-base: `88387e46266dbfc6e1e47363da595db545695ddd`.
Fontes: ADR-0001/0003; RF-LIC-001..005; RN-LIC-001..007; RF-BKP-001..003; DEC-054/058; produto/emissor existentes.
Autorização: instruções explícitas de Maycon nesta conversa e invocação de webfit-task para as quatro fases; decisões específicas abaixo. Sem Git mutável, publicação, instalação real ou acesso pelo agente a cofre/banco clínico.

## 1. Discovery — COMPLETE

### Saída única do painel — 2026-10-09 (LIGHT)

Conclusão LIGHT: TypeScript/Prettier/diff PASS; revisão estática independente `/root/admin_review` aprovada sem findings. Sem ensaio funcional/build neste recorte, ajuste estará no próximo candidato.

Maycon confirmou abertura do painel0.1.12 e da aba Banco e manutenção por screenshots; não comprova operações de banco/GUI. Pediu eliminar botões redundantes. Refinamento RF-ADM-001/TA-ADM-021: manter ação superior com `close()` existente (limpa materiais, solicita logout backend e fecha modal), rótulo Sair do painel autenticado/Fechar painel antes de login; retirar botão inferior. Não muda backend/auth. Manual e expectativa de fechamento do runner existente alinhados, sem teste novo/execução funcional/build neste recorte. Prettier/TypeScript/diff conferidos; instalação atual ainda não contém esse ajuste.

### Candidato superior à instalação — 2026-10-09 (LIGHT)

Instalador0.1.10 recusado como versão anterior no ensaio humano. Leitura somente de metadados do executável instalado confirmou0.1.11-pilot.26.1; banco/segredos não acessados. Correção de empacotamento no escopo: versão0.1.12 alinhada em package/npm lock/Tauri/Cargo/Cargo lock, mantendo proteção contra downgrade. Formatação/diff e consistência dos manifestos conferidos; novo build e instalação pendentes, sem publicação/Git mutável. Maycon deve repetir build-installer e usar arquivo0.1.12.

### Confirmação da senha no preparador — 2026-10-09 (LIGHT)

Conclusão LIGHT: sintaxe PowerShell e diff PASS; script com UTF-8 BOM. Revisão estática independente `/root/admin_review` aprovada sem findings; confirmou ordem antes da gravação e liberação de memória nas falhas. Ensaio interativo não executado, sem leitura da configuração real. Próxima ação humana: repetir preparador com confirmação, depois build/login.

Pedido explícito de Maycon: repetir senha mascarada para evitar erro de digitação. Refinamento de RF-ADM-005/TA-ADM-017..018, sem alterar autorização/criptografia. Plan inline: comparar duas entradas antes de iniciar helper/gravar verificador, preservar configuração anterior na divergência, liberar ambos SecureStrings/BSTR e corrigir codificação do script para Windows PowerShell5.1. Implementado no preparador/manual; configuração real não lida/modificada pelo agente. Maycon relatou provisionamento anterior concluído; esse relato não comprova login. Sem testes funcionais/build solicitados neste recorte.

### Inclusão do gerenciador no instalador — 2026-10-09 (STRICT)

Maycon pediu que o ZIP DB Browser 3.13.1 win64 fornecido seja entregue completo em `GerenciadorBanco/`, ao lado do executável WebFit, inclusive por atualização da instalação existente. Autorização específica para distribuir esse componente, sem lançamento/instalação/publicação pelo agente. Continuação da WEBFIT-16, não nova demanda. RF-ADM-007 aprovado para implementação por este pedido; TA-ADM-022..025 abaixo. Senha mestra ainda não configurada, conforme relato humano; chave do banco permanece individual/fixa e só é revelada pelo painel.

Discovery COMPLETE: pasta informada contém executável SQLCipher, SQLite, DLLs Qt/OpenSSL/runtime e plugins/licenças. ZIP fornecido tem SHA256 `22375e275ec42d96de1d3b8e9ea4ed86d2a3505c4d0ffcbd1af67aa4003e5e4d`, igual à publicação oficial 3.13.1. Arquivos clínicos/DPAPI não foram abertos. Instalador Tauri/NSIS atual usa resources mapeados, mas não inclui o gerenciador. Pipeline piloto compila os mesmos resources; publicação não foi acionada.

Plan APPROVED BY SCOPE: usar resources de diretório mapeado para preservar plugins/subpastas; preparador local/CI com versão/URL/hash fixos, ZIP fornecido ou cache e download oficial no build quando necessário. Extrair somente em cache ignorado do workspace, nunca alterar a pasta instalada da nutricionista/Maycon. Recusar arquivo incompatível/cache modificado, incluir pacote inteiro/licenças. Preparar recursos antes de cargo no pipeline e antes de build/dev Tauri. Nenhum auto-launch, plugin SQL frontend, senha/DB rekey/migration ou dependência npm/Rust nova.

- TA-ADM-022: NSIS contém executáveis/DLLs/plugins/licenças do pacote em `GerenciadorBanco/`, preservando hierarquia.
- TA-ADM-023: nova instalação/atualização usam o mesmo mapeamento de resources; banco/chaves/licença/acessos não são recursos do pacote e não são tocados. Ensaio real de update ainda necessário antes de afirmar entrega na máquina-alvo.
- TA-ADM-024: preparo local e CI reproduzível por ZIP fixo/hash oficial, sem depender do AppData pessoal; falha de download/hash/conteúdo recusa build, não altera instalação existente.
- TA-ADM-025: guia orienta executar SQLCipher.exe e usar chave raw hex da instalação, não senha mestra ou credencial global; licenças do componente distribuídas e fonte indicada.

Arquivos previstos: manifesto público da ferramenta e preparador, `tauri.conf.json`, build-installer/workflow, documentação de requisitos/aceite/rastreabilidade/licenças/manual/checkpoint. Checks proporcionais de hash/inventário/configuração/NSIS e revisão independente; sem testes funcionais novos solicitados neste recorte, sem executar o gerenciador no host ou revelar chave real.

#### Evidência da extensão RF-ADM-007

Resultado final: **EXECUTION COMPLETE / REVIEW PASSED WITH WARNINGS**. Tauri debug NSIS concluído (exit0), candidato `src-tauri/target/debug/bundle/nsis/WebFit Desktop_0.1.10_x64-setup.exe`; não instalado/executado. Revisão independente complementar do manifesto confirmou 107/107 caminhos exatos e hierarquia em `$INSTDIR/GerenciadorBanco`, sem findings adicionais. O download inicial de NSIS foi resolvido; não permanece bloqueio de compilação. Provisionamento mestra, release assinado/publicação, ensaio Windows/SQLCipher/update e aceite humano continuam pendentes; sem READY TO SHIP clínico. Evidência anterior “em geração” registra o momento intermediário do check.

Execução implementada: manifesto público `tools/db-browser/bundle.json`, preparador `scripts/prepare-db-browser.ps1`, hook build/dev e npm, recurso de diretório Tauri, preparação anterior a cargo no workflow e comando do wrapper de instalador corrigido. Sem pacote npm/Rust novo, alteração do banco, execução do gerenciador ou acesso a secrets reais. Manual/instalação/notices/requisitos/aceite/rastreabilidade atualizados.

Checks deste recorte: SHA256 oficial do ZIP PASS; hashes individuais/inventário de 107 arquivos PASS em preparação local e subprocesso PowerShell do Tauri; JSON/Prettier/diff PASS; TypeScript/Vite e Rust Tauri debug offline/locked PASS. Manifesto NSIS gerado: 107 entradas `File /oname=GerenciadorBanco`, comparação exata com o pacote validado PASS, incluindo subpastas/plugins/licenças. Primeira tentativa de bundle falhou ao baixar NSIS por DNS11001; permissão de rede resolveu o download e `makensis` está gerando o candidato. Log isolado `.artifacts/webfit-16/db-browser-bundle.log`. Resultado final do instalador será registrado abaixo.

Revisão independente read-only `/root/admin_review`: P2 na enumeração de arquivos Hidden/System corrigido com `-Force`, travessia por fila e recusa de reparse points antes de descender; preparo repetido PASS. REVIEW PASSED WITH WARNINGS no código; atualização/instalação GUI e acesso SQLCipher não ensaiados. Sem novos testes funcionais no recorte; checks anteriores são históricos. Senha mestra ainda não provisionada, sem aceite/distribuição/Done inferidos.

### Refinamento de linguagem — 2026-10-09 (LIGHT)

Maycon pediu nomes mais entendíveis após a explicação sobre “cofre”. Escopo aprovado RF-ADM-002/TA-ADM-021: somente apresentação e instruções. **Emissor de licenças** (aba), **Dados do emissor** (armazenamento interno), **Backup do emissor de licenças** (arquivo exportado), **Chave interna de emissão** (termo explicativo). “Cofre” em registros técnicos/históricos anteriores identifica o mesmo armazenamento; não é outro componente.

Discovery/Plan inline: trocar rótulos/mensagens no painel/emissor histórico e erros humanos Rust, atualizar manual/seletores visuais existentes; manter IDs internos (`vault`), extensões, autenticação, criptografia e efeitos. Sem requisito funcional novo, Plane extra, Git mutável ou novo build distribuível. Implementado: `AdminPanel`, `admin-session`, `admin.rs`, UI/vault histórico, manual/README, seletor do runner e este checkpoint. Formatação/diff e revisão de texto; testes funcionais anteriores permanecem evidência histórica, não foram repetidos neste recorte literal.

Conclusão LIGHT: TypeScript produto/emissor/fixtures visuais, Prettier dos componentes alterados, cargo fmt --check e git diff --check PASS. Revisão textual independente por `/root/admin_review` aprovada, sem findings; contratos e seletor preservados. Testes funcionais/browser/build não repetidos para renomeação literal. Novos termos estarão no próximo candidato; instalação de uso não atualizada pelo agente.

O produto abre `health.db` com chave aleatória de 32 bytes protegida em `installation.key.dpapi`. Emissor separado guarda identidade Ed25519 em cofre SQLCipher/DPAPI e exporta backup protegido. Raízes públicas de licença entram no build. O ícone de informações oferece login administrativo clínico, sem painel mestra ou revelação da chave.

Maycon quer Desktop pessoal da nutricionista, mantido via AnyDesk, painel em abas disponível no instalador e uma senha mestra para todas as ferramentas, inclusive emissor. Versão web/React/FastAPI é intenção futura. Instalação e atualizações no computador dela são relatos humanos, não verificações deste chat. Planilha WebDiet não aberta; importação de pacientes fora desta demanda. Testes usam dados fictícios; G5/G6/G7 não alterados.

### Requisitos e critérios aprovados para implementação

Origem: Maycon, instruções/anotações e respostas de 2026-10-09. Prioridade: demanda solicitada, neutra no Plane. Aprovação não equivale a aceite final.

| ID | Comportamento | Critérios |
|---|---|---|
| RF-ADM-001 | painel pelo ícone de informações, senha mestra única, sessão/autorização Rust independentes do login clínico | TA-ADM-001..004 |
| RF-ADM-002 | emissor integrado sem segundo login; importar uma vez backup do cofre existente, manter assinatura atual | TA-ADM-005..007 |
| RF-ADM-003 | emitir/importar/aplicar na instalação os cinco tipos atuais, conservando pré-condições/confirmações/consumo | TA-ADM-008..012 |
| RF-ADM-004 | habilitar acesso técnico/revelar chave SQLCipher fixa existente em hexadecimal | TA-ADM-013..016 |
| RF-ADM-005 | atualização substitui verificador mestra sem apagar dados/trocar chave/segredo claro no repo | TA-ADM-017..018 |
| RF-ADM-006 | manutenção completa: Saúde, diagnóstico, backup e recuperação através do painel | TA-ADM-019..021 |

- TA-ADM-001: senha correta abre; errada não revela cofre/chave/dados nem executa funções; login profissional preservado.
- TA-ADM-002: token clínico/ausente/forjado/encerrado não autoriza funções mestra.
- TA-ADM-003: logout, bloqueio Windows, processo/reinício e uma hora de inatividade encerram sessão; UI descarta material sensível ao sair/trocar de aba.
- TA-ADM-004: verificador ausente/inválido recusa mestra sem fallback de fixture e sem bloquear login clínico existente.
- TA-ADM-005: todas as operações de emissor exigem sessão mestra, sem segundo login.
- TA-ADM-006: backup de emissor importado conserva identidade/registro e deve corresponder à raiz pública confiável do build; banco/licença/perfil/pacientes não são substituídos.
- TA-ADM-007: senha/arquivo/cofre incompatível e escrita falha preservam cofre atual; nenhum secret em logs.
- TA-ADM-008: INITIAL só prepara destino vazio; emissão/importação nunca limpa banco preparado.
- TA-ADM-009: transferência requer origem/backup validado e acessos próprios, preservando contratos anteriores/rollback.
- TA-ADM-010: suporte temporário mantém consumo único/quatro horas; mesma senha mestra permite emissão, sem mudar contratos de grants antigos.
- TA-ADM-011: recuperação administrativa confirmada mantém dados/licença e encerra sessões.
- TA-ADM-012: RESET_CLINIC exige backup validado/confirmação, mantém licença/acessos/perfil/auditoria/backups e limpa só inventário aprovado; não é reset de fábrica.
- TA-ADM-013: habilitação exige mestra/ação explícita e snapshot consistente validado em banco preparado; falha não revela chave.
- TA-ADM-014: 64 caracteres hex correspondem ao banco fictício real; segunda conexão SQLCipher confirma leitura/escrita/persistência/integridade.
- TA-ADM-015: atualização/reabertura/revelação repetida preserva chave, UUIDs, números, vínculos/schema; chave errada não abre banco.
- TA-ADM-016: status público/preferences/logs/HTML inicial não contêm chave; retorno sensível só em revelação explícita autorizada.
- TA-ADM-017: verificador novo no candidato permite nova senha/rejeita anterior no painel; contas clínicas/banco/licenças preservados.
- TA-ADM-018: verificador mestra, chave SQLCipher, seed de assinatura e senhas de backup são materiais distintos; rotacionar painel não altera automaticamente os demais.
- TA-ADM-019: entrar no Saúde com mestra usa ADMIN válido, sem renomear/resetar contas; preparação inicial mantém campos próprios.
- TA-ADM-020: diagnóstico/backup/restore validam integridade/versão, sem conteúdo clínico em logs/mensagens.
- TA-ADM-021: abas, loading/vazio/erro/retry, teclado/foco/zoom e confirmações seguem padrões existentes; largura responsiva sem cortar conteúdo.

### Decisões

- D-ADM-001 ACCEPTED: senha mestra única para painel/emissor e acesso completo; não senha clara no código. Origem: instruções e pedido de iniciar.
- D-ADM-002 ACCEPTED: chave SQLCipher existente em hex, sem rekey; resposta humana à pergunta específica.
- D-ADM-003 ACCEPTED: continuar com emissor atual, importando backup uma vez; resposta humana após esclarecimento. Não criar root local/identidade nova nem aceitar root da própria licença.
- D-ADM-004 ACCEPTED no escopo anterior: reset do consultório mantém licença/acessos/perfil/auditoria/backups; reset de fábrica não inferido.
- D-ADM-005 AGENT-PROVISIONAL: sessão separada, bloqueio/inatividade uma hora e PHC Argon2 no build, cofre aberto após autorização. Alta confiança/impacto médio; mecanismos existentes, fail closed.

### Glossário

Senha mestra: entrada no painel. `.webfit-license`: autorização assinada. Código de ativação: acompanha INITIAL v2. Chave de assinatura: seed interna Ed25519 no cofre. `.webfit-issuer-backup`: export protegido da identidade/registro, necessário para integrar cofre atual; pode ainda precisar ser criado por Maycon. Chave hex do banco: 32 bytes atuais, acesso em gerenciador SQLCipher. `.webfit-backup`: backup clínico, distinto do emissor. Senhas de arquivos antigos continuam necessárias para sua decriptação/importação; não são segundo login do painel.

## 2. Plan — APPROVED BY SCOPE

1. Autenticação/sessão mestra em Rust com configuração pública de verificador/versão e preparador local de senha mascarada. Sem senha padrão em release; config vazia deixa mestra indisponível. Provisionamento real feito por Maycon fora do chat.
2. Painel pelo acesso existente, abas Licenças, Banco e manutenção, Cofre; React/FormField/paleta/teclado existentes. Sem nova identidade visual, dependência ou SQL genérico na WebView.
3. Reaproveitar cofre do emissor no produto; root privada em subdiretório próprio SQLCipher/DPAPI. Importar backup com validação prévia contra raízes do build antes de substituir cofre. Ferramenta histórica continua disponível para exportar backup; não ler/mover cofre real pelo agente.
4. Emissão local usa protocolo/grant/verificador/consumo existentes e credencial mestra já verificada, sem novo login. Arquivo e grant locais permitem aplicar a operação no painel. INITIAL/transfer preservam destino vazio; demais efeitos confirmados separadamente. Emissão externa continua por solicitação/arquivo quando necessário.
5. Revelar chave existente só em ação explícita; flag não sensível em settings existente, snapshot antes da primeira habilitação de banco preparado e auditoria antes do retorno. Sem rekey/schema/migration novo. Não há revogação automática da chave já conhecida; SQL externo não garante auditoria funcional. Orientação para fechar WebFit antes de usar gerenciador.
6. Manutenção/entrada clínica reusam ADMIN/comandos e contratos existentes; licença em uso preservada. Senhas de backup antigo são campos de decriptação, não de acesso ao painel.

Arquivos: novos módulos admin/admin_tests e painel/API, config/preparador; service/lib/LoginInfo/App/style; cofre compartilhado com emissor histórico; documentos de requisitos/aceite/rastreabilidade, ADR/decisão/segurança/operação/checkpoint.

Checks: npm format:check/check/issuer:build; cargo fmt/clippy/test offline/locked produto/protocolo/emissor; Tauri debug sem bundle conforme runtime existente; diff. Testes significativos de TA-ADM-001..021 nas fronteiras: senha/token/bloqueio/rotacão, cofre/trust/falhas, cinco tipos/consumo/reset, SQLCipher real/backup/restauração e UI. Fixtures e temporários isolados; sem acesso a secrets/dados reais. Browser mock não prova DPAPI/WebView; ensaio Windows/aceite e revisão independente necessários.

Autorizações suficientes: painel/auth/emissor foram pedidos explicitamente; chave hex/cofre atual escolhidos especificamente. Nenhuma nova crypto/dependência/schema clínico/rekey. Scope Check passa, execução imediata no escopo. Provisionamento/instalação/publicação/Git/dados reais são ações distintas e não executadas pelo agente.

## 3. Execution — COMPLETE (implementação local)

Implementados painel/sessão mestra independentes, verificador mascarado de build sem padrão, cofre atual importado com trust prévio, emissão local dos cinco tipos e emissão inicial por arquivo+código/external request, manutenção/restore/entrada ADMIN e revelação da chave fixa. Flag+auditoria do acesso técnico são transacionais; emissões/cofre e importação clínica são etapas recuperáveis separadas. Reset/recuperação/restore encerram ambas as sessões. Login profissional, schema clínico e criptografia existentes preservados. Não executado provisionamento real, importação de cofre real, Git mutável ou publicação.

Inventário: `src/AdminPanel.tsx`, `src/admin-session.ts`, App/LoginInfo/LicensePanel/style; `src-tauri/src/admin.rs`, `admin_tests.rs`, service/lib/Cargo.toml, `admin-access.json`, `src-tauri/src/bin/admin-verifier.rs`; cofre compartilhado no emissor histórico; `scripts/configure-admin-access.ps1`, `scripts/admin-visual-smoke.mjs`, `tests/visual/admin.html`, `admin.tsx`, `tests/unit/admin-session.test.ts`; requisitos/aceite/rastreabilidade, ADR-0003/0004/índice, DEC-059/harness, segurança/instalação/[manual](../../docs/operations/admin-panel.md), checkpoint final.

Checks da execução: npm check PASS (54 Node, lint/TypeScript/Vite); 56 Rust/SQLCipher PASS, com sete testes administrativos e três do cofre compartilhado, além dos contratos anteriores. Browser mock cinco cenários PASS: senha inválida, login/abas/chave/logout, retry após falha de status, resposta pendente após bloqueio, verificador ausente e janela estreita sem overflow horizontal. Tipo visual PASS após corrigir cast do mock; syntax do preparador PowerShell PASS, sem senha real digitada. Cargo fmt produto/emissor e diff PASS; issuer:build PASS. Logs/capturas isolados em `.artifacts/webfit-16/` ignorados. Repetições/checks do estado final ficam na revisão.

Correções internas: variáveis CSS alinhadas à paleta; retry do status após login; refresh pós-operação que revoga mestra; flag/auditoria atômicas; seed temporária protegida em memória. Primeiro mock falhou por comando/seletores do próprio teste, corrigidos; nenhum teste de produto enfraquecido.

Cobertura: TA-ADM-001..020 nas fronteiras Rust/SQLCipher e contratos existentes; TA-ADM-003/016/021 complementar UI mock/guard. Bloqueio é chamado pelo evento Windows existente, mas seu disparo real no WebView2 não foi ensaiado. Rotação simulada de verificador preserva chave; atualização real não ensaiada. GUI SQLCipher NOT RUN (conexão nativa com raw hex PASS). Teclado/foco/zoom nativos e aceite humanos pendentes, não declarar TA-ADM-021 integralmente aceito.

## 4. Code Review — REVIEW PASSED WITH WARNINGS

Passagem independente read-only por `/root/admin_review`, separada do implementador. Inicialmente CHANGES REQUIRED: dois P2 reais encontrados; corrigidos dentro do Plan e reavaliados, sem impeditivo restante na revisão estática. Revisor leu logs/código/diff; não executou checks novamente nem acessou instalação de uso.

| Achado | Correção e evidência |
|---|---|
| P2: código de emissão poderia reaparecer após bloqueio durante refresh externo | guard revalidado após onRefresh, resultado apresentado antes da espera e removido por clear; cenário pending-code bloqueia e refaz login, código não reaparece: PASS |
| P2: auditoria final falha após commit no cofre e perde código/caminho da emissão | auditoria de início obrigatória antes de efeito; falha final conserva resultado/código/arquivo com auditWarning visível. Teste ativa código retornado, verifica arquivo/importação e impede arquivo se auditoria de início falha: PASS |

### Checks do estado final — 2026-10-09

| Check | Resultado |
|---|---|
| npm run check | PASS: lint, TypeScript, 54 Node, Vite; bundle 573,16 kB WARNING existente/ampliado |
| npm run format:check | PASS |
| npm run issuer:build | PASS |
| tsc --project tests/visual/tsconfig.json --noEmit | PASS |
| node scripts/admin-visual-smoke.mjs | PASS: seis cenários, incluindo resposta pendente de chave/código, retry, ausência de verificador, abas/logout e reflow 640px |
| Prettier dos novos scripts/fixtures/config | PASS |
| cargo fmt --check produto/protocolo/emissor | PASS |
| cargo clippy --offline --locked --all-targets -- -D warnings, produto/protocolo/emissor | PASS; fallback de cache por cópia WARNING |
| cargo test --offline --locked produto | PASS: 57 Rust, SQLCipher real/DPAPI CurrentUser em fixtures locais; oito testes administrativos e contratos existentes |
| cargo test --offline --locked protocolo / emissor histórico | PASS: três / três testes |
| node node_modules/@tauri-apps/cli/tauri.js build --debug --no-bundle -- --offline --locked | PASS, repetido após correções; debug.exe não iniciado/instalado; OpenSSL sem PDB e STATIC_VCRUNTIME WARNING |
| Parse AST configure-admin-access.ps1; admin-verifier stdin fixture | PASS, sem gravar configuração real/imprimir PHC/senha; teste do script interativo real NOT RUN |
| git diff --check / inspeção de secrets e links documentais locais | PASS; helper imprime somente PHC ao processo preparador, nenhum secret de uso acessado |

Ambiente Windows, Rust/Cargo 1.98.1, Node 22.21.0, Chrome headless existente; Perl local `.tools/strawberry`, temporários/logs/capturas em `.artifacts/webfit-16/`. Não instalada dependência. Testes nativos usam `CryptProtectData/UnprotectData` reais no perfil de execução, não fake; não comprovam migração entre perfis/máquinas nem evento real de bloqueio no WebView2.

Correctness/Security estáticos e fronteiras automatizadas PASS no escopo; UI mock PASS, capturas de Licenças ampla e Cofre estreito inspecionadas. Impeccable engine indisponível, análise pelas referências/padrões existentes; Mantis sem integração, sem auditoria externa inferida. Sem finding impeditivo aberto. GUI SQLCipher, evento Windows/WebView2, teclado/foco/zoom nativos, atualização/provisionamento reais e aceite funcional NOT RUN. Não declarar READY TO SHIP clínico, dados reais/G7, distribuição ou Plane Done.

### Evidência final e próxima ação

Implementado e verificado localmente; documentação de requisitos/aceite/rastreabilidade, regras/escopo, ADR/decisão, segurança/instalação/manual e checkpoint atualizada junto. Fonte0.1.10, sem novo instalador/bump/release. Git: branch/base/HEAD inalterados, upstream local 0/0 sem fetch; diff e alterações preexistentes preservados, sem commit/push. Work Item único WEBFIT-16 em Review, aguardando aceite.

Maycon: preparar senha mestra por `scripts/configure-admin-access.ps1` fora do chat; exportar backup protegido do emissor atual; gerar candidato pelo fluxo humano, validar em instalação fictícia separada e importar cofre compatível, testar painel/update/chave no gerenciador e então decidir aceite/distribuição. D-ADM-005 continua decisão técnica provisória não bloqueante para validação no aceite. Nenhum acesso ao banco/cofre/pacientes reais feito pelo agente.

Checklist: [x] Discovery/Plan/autorização específica; [x] implementação completa; [x] checks/fixtures; [x] review independente e correção de findings; [x] docs/rastreabilidade; [ ] provisionamento humano; [ ] ensaio Windows/GUI/update; [ ] aceite/integração/distribuição.

### Correção de download no CI — 2026-10-09

Maycon relatou falha do workflow em `npm run prepare:db-browser`: Windows PowerShell 5.1 lançou `Invoke-WebRequest : Falha na operação de descriptografia` ao baixar o ZIP fixado. O erro ocorre durante a transferência, antes da validação SHA-256; a causa interna TLS/rede não foi comprovada pelo log. Ajuste local: repetir a transferência até três vezes com espera crescente, remover arquivo parcial entre tentativas e manter a validação SHA-256 obrigatória antes de mover para o cache/extrair. Fonte, versão e hash não mudaram; sem fallback inseguro nem relaxamento TLS. Código/consistência revisados estaticamente. No momento desta alteração, testes e rerun ainda não haviam sido executados; o resultado do push está registrado abaixo.

Resultado posterior: commit `50057fdb06fb081bd2e0530b3392a39c3784593d` foi enviado a `main`; run #28 falhou na preparação porque ainda usava `Invoke-WebRequest`. Substituí o transporte pelo `fetch` nativo do Node instalado no CI, com três tentativas, timeout, remoção de parcial, redirects limitados a HTTPS e download máximo de 128 MiB; TLS padrão e SHA-256 fixado antes do cache/extração permanecem. `node --check`, AST PowerShell, `git diff --check`, download real mais SHA-256, `npm run prepare:db-browser` e revisão independente PASS. Commit `f746994ced1105759a25de5032e7f61993667c27` enviado a `main`. Run #29 (`https://github.com/Maycon-bd/WebFit-DESKTOP/actions/runs/37984737761`): `Prepare pinned database manager resources` PASS no runner, mas `cargo test --locked --manifest-path src-tauri/Cargo.toml` falhou em `Test product and SQLite recovery`; build e publicação foram pulados. API de logs retornou 403, então não foi possível identificar o erro Rust. O ZIP foi baixado e preparado no CI, mas o instalador final ainda não foi construído/publicado. Próximo passo: obter de Maycon o trecho de erro do `cargo test` para resolver a falha bloqueadora e deixar o pipeline validar o pacote completo. A remoção do ZIP continua sendo o fallback se preparação/empacotamento falhar após o teste passar.

### Evidência inicial

- Git read-only: várias alterações preexistentes em DESIGN/docs/status/requisitos/specs, App/FormField/LicensePanel/PatientSexField/style e testes; scripts/specs/visual fixtures não rastreados. Nenhum trabalho removido.
- Plane: 15 itens listados/WEBFIT-10 recuperado; sem demanda de painel integrado. WEBFIT-16 criado uma vez em Planning/Fundação; WEBFIT-10 preservado.
- Inspeção de service/security/database/license/recovery, acesso React e cofre existente; runtime Rust/Cargo 1.98.1 disponível. Sem testes de produto executados nesta Discovery.
- Impeccable launcher indisponível por engine/cache fora do workspace; sem instalação. PRODUCT/DESIGN/referências lidos diretamente; UI herda padrão existente.
- [SQLCipher API](https://www.zetetic.net/sqlcipher/sqlcipher-api/) confirma chave bruta 32 bytes/64 hex. GUI SQLCipher ainda não ensaiada; gerenciador sem suporte à cifra não basta.
