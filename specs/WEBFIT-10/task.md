# WEBFIT-10 — Ativação offline e autorizações por instalação

- Data: 2026-10-08. Nível: STRICT. Responsável técnico/PO: Maycon.
- Branch: `main`; HEAD-base: `e07cdc8300de0421dbdc7fd64aafe7d30a191e80`.
- Plane: `119b1627-dd4a-4a4f-b015-64ee60183afb`, WEBFIT-10, módulo Fundação, **Planning**, sincronizado; prioridade neutra, sem prazo inventado.
- Entrada: invocação explícita de webfit-task e anotações de Maycon nesta conversa. Autoriza iniciar demanda e registrar escolhas; não equivale a aceite de detalhes ainda indefinidos.
- Fase: Plan em elaboração; Discovery funcional concluída para o início solicitado. Primeira atividade pendente: detalhar protocolo técnico/Scope Check, custódia e recuperação.
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

## 2. Plan parcial

### Abordagem e impacto esperado (ainda sem execução de produto)

1. T-LIC-001: registrar aprovações, requisitos/aceite, ADR proposto e decisões materiais. **Concluído documentalmente nesta sessão.**
2. T-LIC-002: D-LIC-001..003 respondidas; fechar desenho de protocolo/custódia/recuperação. Investigar algoritmo e APIs oficiais compatíveis; nenhuma biblioteca nova escolhida/aprovada neste registro.
3. T-LIC-003: implementar fronteira Rust de solicitação/importação/assinatura/vínculo/consumo; manter IPC tipado, erros seguros, autorização no backend e auditoria sem payloads sensíveis.
4. T-LIC-004: implementar emissor separado; chave privada fora do repo/frontend/instalador clínico; definir salvamento dos artefatos e orientação Bitwarden sem integração externa.
5. T-LIC-005: incremento vertical de ativação inicial e credenciais; UI de aguardo/solicitação/importação/preparação, persistência transacional e testes observáveis.
6. T-LIC-006: compatibilidade não destrutiva de bancos de teste e interação com atualização, backup/restauração e consumo das autorizações; entrega inicial em instalação vazia. Avaliar migração numerada/banco vazio/versão anterior antes de alterar schema.
7. T-LIC-007: transferência/recuperação e recuperação administrativa, preservando dados e identidade correta do destino.
8. T-LIC-008: suporte temporário conforme regra decidida; relógio controlado em testes e limite explícito contra manipulação do relógio/rollback offline.
9. T-LIC-009: reinicialização somente após desenho/autoridade suficientes, backup validado, confirmação e teste de falha/recuperação. A autorização de tipo não autoriza apagar banco real nesta sessão.
10. T-LIC-010: **adiada para outra demanda**, por D-LIC-005: pacote de suporte isolado e política de retorno. Não executar neste escopo.
11. T-LIC-011: sincronizar documentação, executar checks do produto afetado e review independente com evidência; dados fictícios, sem Git/publicação automáticos.

Arquivos previstos: `src-tauri/src/service.rs`, `security.rs`, `database.rs`, `recovery.rs`, testes Rust/SQLite; módulos novos de licença conforme responsabilidade; `src/App.tsx` e UI/contratos relacionados; ferramenta de emissão em local a definir; documentos de requisitos, arquitetura, instalação, backup e rastreabilidade. Manifests só se houver necessidade e autorização de dependência. Não promover spike G4.

### Verificação planejada

- TA-LIC-001..005: integração real SQLite, assinatura adulterada/destino errado/versão inválida, chamadas diretas IPC, repetição, falha/interrupção e segredo ausente no bundle/logs.
- TA-LIC-006..009: backup/restauração de destino fictício, sessão de suporte com relógio controlado, recuperação administrativa e reinicialização cancelada/falha de backup preservando dados.
- TA-LIC-010/011: ensaio Windows de atualização/legado e teclado/foco/carregamento/erro/repetição. TA-LIC-012 adiado com o pacote de suporte.
- Formatação, lint, TypeScript, frontend, Rust/SQLite e build Tauri conforme DoD quando houver código. Neste início documental: links, IDs/rastreabilidade, consistência de status e diff.

Scope Check: início/documentação autorizados e concluídos; D-LIC-001..005 resolvidas. Plan técnico ainda em elaboração: protocolo/custódia/recuperação/schema/dependências precisam de proposta concreta antes de avaliar operações sensíveis. Nenhum gate genérico entre fases ou novo pedido de aprovação do fluxo. ADR-0003 proposto, sem aceite por inferência. G5 em execução/G6/G7 não concluídos; relato de começar a usar não aprova dados reais.

## 3. Execution

Registro documental iniciado; produto, banco, credenciais, instalador e dependências não alterados por WEBFIT-10. Testes de comportamento ainda NOT RUN. Não confundir critérios registrados com implementados/verificados.

## 4. Code Review / evidência do início

Autorrevisão documental: fonte humana identificada, comportamento aprovado separado de lacunas; nenhuma promessa de consumo global offline ou revogação remota. Review independente ainda NOT RUN; não declarar READY TO SHIP.

Checks: `git diff --check -- docs .harness/knowledge/DECISIONS-REGISTER.md` PASS; PowerShell: 109 links locais e 5 âncoras novas PASS, caracteres invisíveis/whitespace dos dois arquivos novos PASS, definições dos 32 IDs RF/RN/TA/UC-LIC PASS (inclui registros adiados). Fonte/status revisados manualmente. Produto/formatação TS/lint/testes frontend/Rust/SQLite/build: N/A neste início documental; comportamento de licença NOT RUN. Não comprova aceite/review independente.

Plane: busca dos nove itens do projeto sem correspondente; criado um WEBFIT-10, associado a Fundação; Decision Review durante esclarecimento, retorno a Planning após D-LIC-004/005. Prioridade neutra/módulo preservados; nenhuma outra demanda alterada. Limites: nenhuma licença real emitida, banco aberto/copiado/restaurado, senha solicitada ou instalador exercitado. Alterações preexistentes do harness/WEBFIT-6/7/8/9 preservadas. Git/publicação sob Maycon.

Próxima ação: detalhar arquitetura/contratos/custódia/recuperação e avaliar migração/dependências, sem repetir D-LIC-001..005 nem exigir aprovação genérica já coberta pela invocação. Início documental concluído; execução do produto ainda pendente.
