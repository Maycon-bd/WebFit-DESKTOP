# Implementation Plan: Primeiro incremento de Saúde

**Branch**: `feature/pbi-001-primeiro-incremento-saude` | **Date**: 2026-09-15 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-primeiro-incremento-saude/spec.md`

## Summary

O primeiro incremento entrega o núcleo operacional do espaço Saúde em uma instalação local e offline: autenticação e sessão, perfil profissional, pacientes, rascunhos protegidos, plano alimentar/orientações, auditoria e backup/restauração. O plano organiza a execução vertical desses fluxos, mas mantém a composição técnica como hipótese sujeita ao spike do ADR-0001 e aos gates G4/G5. Educação, sincronização entre máquinas, nuvem e colaboração ficam fora.

## Technical Context

**Language/Version**: A validar no spike G4; hipótese autorizada para teste: Rust na fronteira local e TypeScript na interface.

**Primary Dependencies**: Nenhuma dependência nova aprovada. A necessidade e a versão de cada dependência devem ser justificadas e submetidas ao gate ASK-FIRST.

**Storage**: Persistência local embarcada; SQLite é a proposta do ADR-0001 para o spike. Não usar banco em pasta de rede ou sincronizada.

**Testing**: Testes unitários de domínio, integração de persistência, contrato de comandos, aceitação dos TA-* e ensaios de backup/restauração; ferramentas definitivas dependem do spike.

**Target Platform**: Windows 10 x64, computador único por instalação, núcleo Saúde funcional sem internet.

**Project Type**: Aplicação desktop local/offline.

**Performance Goals**: Abertura até 5 s; pesquisa/abertura de paciente até 1 s no p95; salvamento comum até 2 s no p95, usando a base fictícia de 2.400 pacientes.

**Constraints**: Dados de saúde sensíveis; autorização na fronteira confiável; nenhum segredo ou dado clínico em logs; instantes UTC; foreign keys, transações e consultas parametrizadas; backup por snapshot consistente; restauração validada e confirmada; sem SQL genérico na interface.

**Scale/Scope**: Dois papéis locais com acesso total no MVP, espaço Saúde, primeiro incremento funcional, dados fictícios, um computador por instalação. Educação e múltiplas máquinas são evolução separada.

## Constitution Check

*GATE: PASS para pesquisa e design; implementação permanece bloqueada até G4/G5 e aprovação humana.*

- Specification antes de implementação: PASS. A spec referencia RFs, RNFs, regras e TAs aprovados.
- Segurança e privacidade: PASS com controles a comprovar no spike. Nenhum dado real será usado.
- Decisões explícitas: PASS. ADR-0001 continua proposta para o spike; D-AUTO-001/002 foram aceitos por Amanda e Maycon em 2026-09-17.
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

### Phase 1 — Spike G4 da arquitetura

- Provar shell desktop, ciclo de vida e empacotamento Windows.
- Provar persistência, foreign keys, transações, banco vazio e migração de versão.
- Provar comandos tipados e autorização fora da interface.
- Provar proteção local de banco, arquivos, chaves e backup.
- Provar criação de snapshot, checksums, restauração segura e falhas de permissão/espaço.
- Medir os RNFs com dados fictícios.
- Resultado possível: aceitar, revisar ou rejeitar ADR-0001; qualquer resultado exige registro e aprovação.

### Phase 2 — Fundação vertical

Somente após aprovação de G4/G5: shell, identidade/sessão, persistência mínima, migrações testadas, tratamento de erro e testes de fundação juntos.

### Phase 3 — Fluxos clínicos verticais

Entregar em ordem de dependência: perfil e espaço Saúde; pacientes e tags; rascunhos; prescrição, composição e metas; cada fatia com interface, domínio, persistência, autorização, auditoria e testes.

### Phase 4 — Operação e recuperação

Entregar consulta de auditoria e backup/restauração com os testes TA-AUD-* e TA-BKP-*, incluindo falhas e preservação do estado atual.

### Phase 5 — Convergência e gates

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

- PASS: o design não cria requisitos aceitos, não altera o schema e não escolhe dependências.
- PASS: o modelo separa Saúde de Educação e não assume sincronização.
- PASS: contratos proíbem acesso genérico a dados pela interface e exigem autorização.
- PASS: backup/restauração, auditoria, logs e dados fictícios estão cobertos.
- PENDING HUMAN: proteção criptográfica, resultado do ADR-0001 e aprovação de implementação após o spike G4.