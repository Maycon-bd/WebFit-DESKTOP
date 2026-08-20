# Jornadas do produto

**Status:** primeira jornada do MVP Saúde validada em 2026-08-20.

## Primeiro incremento

```text
instalar → criar ou acessar usuário → autenticar → entrar no espaço Saúde
→ cadastrar perfil → cadastrar paciente → localizar e abrir paciente
→ editar → arquivar → restaurar → criar prescrição e cardápio
→ calcular e finalizar → criar backup
→ restaurar em teste → fechar e reabrir preservando dados
```

## Evolução do MVP Saúde

```text
paciente → atendimento → anamnese → antropometria
→ prescrição/cardápio → documento A4 → financeiro e planner
→ relatórios/exportações → backup e recuperação
```

## Pontos transversais

- Toda operação é autorizada no backend.
- Ações críticas são auditadas.
- Formulários longos podem recuperar rascunhos.
- Erros não podem simular sucesso.
- Dados salvos sobrevivem ao fechamento e à reabertura.

O espaço Educação terá jornada própria após descoberta. Não reutilizar automaticamente entidades ou fluxos clínicos.
