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
