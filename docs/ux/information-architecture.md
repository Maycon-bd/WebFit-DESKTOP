# Arquitetura da informação

**Status:** estrutura do primeiro incremento aprovada.

```text
Aplicação
├── Primeiro acesso
├── Login
├── Seleção de espaço
│   └── Saúde
├── Saúde
│   ├── Início
│   ├── Pacientes
│   │   ├── Lista e pesquisa
│   │   ├── Novo paciente
│   │   ├── Perfil do paciente
│   │   └── Arquivados
│   ├── Perfil profissional
│   ├── Backup e restauração
│   └── Auditoria
│       ├── Lista paginada
│       ├── Filtros
│       └── Detalhe de metadados
└── Sessão
    ├── Bloquear
    ├── Trocar senha
    └── Sair
```

Educação não aparece como funcionalidade simulada no MVP. A estrutura poderá receber outro espaço após requisitos próprios.

## Princípios

- Fluxos diretos, com formulário único organizado e ações principais evidentes.
- Estado vazio, carregamento, erro e confirmação reais.
- CPF mascarado em listagens.
- Pacientes ativos e arquivados claramente separados.
- Ações destrutivas ou de substituição exigem confirmação.

## Personalização — WEBFIT-22

RF-UX-009: Configurações → Personalização → Tema do aplicativo (Claro/Escuro). Voltar às Configurações usa a navegação/foco existente. Seleção imediata e preferência local ao computador; falha de gravação informa aplicação apenas na sessão e permite retry. Não acrescenta domínio ou acesso remoto.
