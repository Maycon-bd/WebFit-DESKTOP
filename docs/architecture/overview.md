# Visão geral da arquitetura

**Status:** direção aprovada para spike; implementação ainda não comprovada.

## Composição a validar

- Tauri 2 como shell desktop.
- React, TypeScript e Vite na interface.
- Rust como fronteira de comandos, domínio, autorização, arquivos e persistência.
- SQLite nativo para dados locais.
- Arquivos privados no filesystem com UUID, metadados e hashes no banco.
- Comandos pequenos e tipados; nenhum SQL genérico na WebView.

## Fronteiras funcionais

```text
Aplicação
├── Identidade e sessão
├── Perfil do usuário
├── Espaços de trabalho
│   ├── Saúde (MVP)
│   └── Educação (futuro, não implementado)
├── Pacientes
├── Auditoria
└── Backup e restauração
```

O perfil pertence ao usuário. Pacientes, tags, rascunhos e dados clínicos pertencem ao espaço Saúde. Educação não compartilha automaticamente o modelo clínico.

## Restrições vigentes

- Núcleo local, offline, Windows-first e em um computador por instalação.
- Ambos os papéis aprovados possuem acesso total; toda autorização continua sendo validada no backend.
- Nenhum segredo ou dado de domínio em `localStorage` ou armazenamento inadequado do frontend.
- Foreign keys em toda conexão, consultas parametrizadas e transações.
- Instantes em UTC; datas civis preservadas como datas; valores monetários em centavos.
- Atualização conectada, recuperação remota e backup em nuvem estão fora do MVP e exigem ADR.

## Próxima evidência

O spike do ADR-0001 deve validar empacotamento Windows, SQLite, migrações, autenticação, proteção local, comandos tipados, backup, restauração e metas não funcionais.
