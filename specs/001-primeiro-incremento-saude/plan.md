# Implementation Plan: Primeiro incremento de Saúde

**Branch**: `feature/pbi-001-primeiro-incremento-saude` | **Date**: 2026-09-21 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-primeiro-incremento-saude/spec.md`

## Summary

O primeiro incremento entrega o núcleo operacional do espaço Saúde em uma instalação local e offline: autenticação e sessão, perfil profissional, pacientes, rascunhos protegidos, plano alimentar/orientações, auditoria e backup/restauração. O plano organiza a execução vertical desses fluxos, mas mantém a composição técnica como hipótese sujeita ao spike do ADR-0001 e aos gates G4/G5. Educação, sincronização entre máquinas, nuvem e colaboração ficam fora. A distribuição do canal piloto é uma trilha operacional separada, aprovada pelo ADR-0002, sem alterar o escopo clínico.

## Technical Context

**Language/Version**: Rust na fronteira local e TypeScript na interface; direção aceita pelo ADR-0001, com versões exatas a serem fixadas no G5.

**Primary Dependencies**: A fundação aceita Tauri 2, React, TypeScript, Vite, Rust, SQLite/SQLCipher e DPAPI. As dependências do updater foram instaladas somente no spike descartável após T081; o produto ainda não recebeu essas dependências, e versão, licença e segredo correspondente exigem avaliação própria.

**Storage**: Persistência local embarcada; SQLite é a proposta do ADR-0001 para o spike. Não usar banco em pasta de rede ou sincronizada.

**Testing**: Testes unitários de domínio, integração de persistência, contrato de comandos, aceitação dos TA-* e ensaios de backup/restauração; ferramentas definitivas dependem do spike.

**Target Platform**: Windows 10 x64, computador único por instalação, núcleo Saúde funcional sem internet.

**Project Type**: Aplicação desktop local/offline.

**Performance Goals**: Abertura até 5 s; pesquisa/abertura de paciente até 1 s no p95; salvamento comum até 2 s no p95, usando a base fictícia de 2.400 pacientes.

**Constraints**: Dados de saúde sensíveis; autorização na fronteira confiável; nenhum segredo ou dado clínico em logs; instantes UTC; foreign keys, transações e consultas parametrizadas; backup por snapshot consistente; restauração validada e confirmada; sem SQL genérico na interface.

**Scale/Scope**: Dois papéis locais com acesso total no MVP, espaço Saúde, primeiro incremento funcional, dados fictícios, um computador por instalação. Educação e múltiplas máquinas são evolução separada.

## Constitution Check

*GATE: PASS para preparação e design; G4/ADR-0001 estão aceitos, mas implementação permanece bloqueada até aprovação específica do G5 e gates sensíveis.*

- Specification antes de implementação: PASS. A spec referencia RFs, RNFs, regras e TAs aprovados.
- Segurança e privacidade: PASS com controles a comprovar no spike. Nenhum dado real será usado.
- Decisões explícitas: PASS. ADR-0001 foi aceito no G4; ADR-0002/DEC-043 aprovam o canal piloto e mantêm o updater sujeito a spike e gates de implementação; D-AUTO-001/002 foram aceitos por Amanda e Maycon em 2026-09-17.
- Complexidade mínima: PASS. Não há servidor, sincronização ou dependência externa no incremento.
- Rastreabilidade: PASS para o design; tasks, testes e Evidence ainda serão produzidos nas fases seguintes.
- Mudança controlada: PASS. Schema, migrações, dependências, autenticação e arquitetura de produção exigem gate sensível.
- STRICT: obrigatório por autenticação, dados clínicos, auditoria, backup e persistência.
- Condições de parada: resolver o resultado do spike, validar decisões provisórias e obter Human Gate antes de schema ou implementação.

## Research Strategy

### Phase 0 — Research

1. Validar a hipótese desktop local do ADR-0001 contra os critérios de empacotamento, persistência, migração, autorização, proteção local e recuperação.
2. Confirmar a restrição de que SQLite não pode ser compartilhado por rede e registrar a consequência para a futura Educação.
3. Comparar opções de proteção de banco, arquivos, chaves e backups sem escolher produção por inferência.
4. Definir semântica determinística de auditoria: UTC, intervalo semiaberto, ordenação, limite de 50 e cursor.
5. Verificar protocolos clínicos e regras nutricionais já aprovados sem alterar seus valores ou escopo.
6. Definir critérios de teste para backup, restauração, erro seguro, dados fictícios e desempenho.

A consolidação está em [research.md](research.md).

## Design Outputs

- [data-model.md](data-model.md): modelo conceitual, relacionamentos, estados e validações.
- [contracts/authorized-operations.md](contracts/authorized-operations.md): fronteira de operações autorizadas e erros seguros.
- [quickstart.md](quickstart.md): roteiro de validação para o spike e para a futura implementação.
- [research.md](research.md): decisões de planejamento e pontos que continuam dependentes de gate.
- [spec.md](spec.md): escopo e critérios funcionais.

## Execution Phases

### Phase 0 — Fechar pesquisa e decisões

- Reproduzir os critérios mínimos do ADR-0001.
- Registrar evidência de ambiente e limitações.
- Submeter D-AUTO-001/D-AUTO-002 à validação humana.
- Não instalar dependências nem executar migração do produto.

### Phase 1 — Spike G4 da arquitetura (concluído)

- Provar shell desktop, ciclo de vida e empacotamento Windows.
- Provar persistência, foreign keys, transações, banco vazio e migração de versão.
- Provar comandos tipados e autorização fora da interface.
- Provar proteção local de banco, arquivos, chaves e backup.
- Provar criação de snapshot, checksums, restauração segura e falhas de permissão/espaço.
- Medir os RNFs com dados fictícios.
- Resultado: ADR-0001 aceito, G4 encerrado e evidência registrada; detalhes de produção permanecem condicionados ao G5.

### Phase 1A — Preparação do canal piloto do G5

A decisão T081 permite a preparação local no spike descartável. A fundação vertical do produto continua separada; a configuração externa do runner/repositório e a primeira publicação permanecem em T082/T083.

- definir contrato do canal piloto, SemVer pré-release, `latest.json`, notas, checksums e promoção para estável;
- definir o fluxo de `main` → runner Windows → artefato assinado → repositório público separado;
- definir custódia, recuperação e rotação da chave privada do updater;
- preparar casos de teste para assinatura inválida, rede indisponível, backup pré-atualização, migração, interrupção e retorno;
- registrar inventário de dependências, licenças, permissões Tauri e critérios de custo zero;
- registrar a configuração externa de runner, repositório, secrets e endpoint em T082;

### Phase 2 — Fundação vertical

Somente após aprovação de G4/G5: shell, identidade/sessão, persistência mínima, migrações testadas, tratamento de erro e testes de fundação juntos.

### Phase 3 — Fluxos clínicos verticais

Entregar em ordem de dependência: perfil e espaço Saúde; pacientes e tags; rascunhos; prescrição, composição e metas; cada fatia com interface, domínio, persistência, autorização, auditoria e testes.

### Phase 4 — Operação e recuperação

Entregar consulta de auditoria e backup/restauração com os testes TA-AUD-* e TA-BKP-*, incluindo falhas e preservação do estado atual.

### Phase 5 — Convergência, atualização piloto e gates

Executar checklist, Tasks, Analyze, Human Gate, Implement, Converge, Verification, Review, Security Gate condicional, Evidence e aprovação final. Nenhum commit, push, merge ou release é automático.

## Project Structure

A árvore abaixo é uma estrutura candidata para validar no spike; o repositório ainda não possui código.

~~~text
specs/001-primeiro-incremento-saude/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── authorized-operations.md
├── checklists/
│   └── requirements.md
└── tasks.md                  # criado somente por speckit-tasks

src/                           # interface, após aprovação da fundação
src-tauri/                     # comandos, domínio, persistência e arquivos, após G4
tests/
├── unit/
├── integration/
├── acceptance/
└── security/
~~~

**Structure Decision**: manter a separação de interface e fronteira confiável proposta pelo ADR-0001, com fatias verticais por domínio. A árvore só se torna compromisso de implementação após o spike e a decisão arquitetural.

## Constitution Check — Post-Design

- PASS: o design não cria requisitos clínicos aceitos nem altera o schema do produto; a preparação de dependências ficou restrita ao spike descartável e a trilha do updater está documentada no ADR-0002.
- PASS: o modelo separa Saúde de Educação e não assume sincronização.
- PASS: contratos proíbem acesso genérico a dados pela interface e exigem autorização.
- PASS: backup/restauração, auditoria, logs e dados fictícios estão cobertos.
- PENDING HUMAN: aprovação específica para iniciar a implementação do G5; T082/T083 ainda exigem configuração externa e validação do canal piloto.