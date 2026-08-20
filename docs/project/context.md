# Contexto e decisões iniciais — WebFit Desktop

## Problema

Profissionais de nutrição precisam organizar informações do atendimento e acompanhamento clínico sem depender de assinatura, servidor público ou conexão contínua com a internet.

## Direção aprovada

- Aplicativo desktop local e offline.
- Plataforma inicial Windows, com Windows 10 como ambiente-alvo da stakeholder.
- Um computador por instalação no MVP.
- Dados locais com backup e restauração dentro do produto.
- Sem hospedagem e mensalidade obrigatória.
- Interface do WebFit Web é referência de descoberta, não base arquitetural.
- Uma instalação pode conter espaços por domínio: Saúde no MVP e Educação no futuro.

## Governança

- Amanda é stakeholder, especialista do domínio e aprovadora funcional.
- Maycon é Product Owner, responsável técnico, administrador e aprovador técnico.
- Escopo e mudanças relevantes são aprovados conjuntamente.
- Feedback de Sprint Review atualiza o backlog sem remover os gates de requisitos e qualidade.

## Decisões de fundação

| ID | Decisão | Status |
|---|---|---|
| DEC-001 | criar o WebFit Desktop como produto/repositório novo | aprovada |
| DEC-002 | pausar o WebFit Web | aprovada |
| DEC-003 a DEC-006 | validar Tauri, React, TypeScript, Vite, Rust e SQLite por spike | aprovadas para spike |
| DEC-007/008 | não importar arquitetura web; curar somente comportamento validado | aprovadas |
| DEC-009 | usar requisitos rastreáveis e gates | aprovada |
| DEC-010 | usar Git Flow | aprovada |

O registro completo está em [decision-log.md](decision-log.md).

## Escopo aprovado

O Gate G1 foi aprovado em 2026-08-20 para o MVP Saúde. O primeiro incremento inclui autenticação, perfil, espaço Saúde, pacientes, prescrições e cardápios individualizados, auditoria e backup/restauração mínima. Agenda, atendimento, anamnese, antropometria, prescrições/cardápios, arquivos, documentos, financeiro, planner e relatórios seguem como incrementos do mesmo MVP, condicionados a requisitos próprios.

Educação, nuvem, sincronização entre computadores, portal do paciente e comunicação remota estão fora do MVP Saúde.

## Primeira jornada

```text
autenticar → entrar no Saúde → cadastrar perfil → cadastrar/localizar paciente
→ editar → arquivar/restaurar → criar backup → restaurar em teste
→ fechar e reabrir preservando dados
```

## Volume e operação

- Cerca de 80 pacientes existentes, sem migração automática presumida.
- Crescimento esperado de 30 a 40 pacientes por mês.
- Cerca de 2.400 pacientes em cinco anos.
- Backup diário e manual, retenção de 60 dias, RPO de 24 horas e RTO até o próximo dia útil.

Fontes: [entrevista — rodada 01](stakeholder-interview-round-01.md), [escopo](../product/scope.md) e [decisões](decision-log.md).
