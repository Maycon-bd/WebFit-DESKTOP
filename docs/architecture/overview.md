# Visão geral da arquitetura

**Status:** proposta não comprovada; sujeita ao [ADR-0001](adr/ADR-0001-desktop-tauri-sqlite.md) e ao spike.

## Hipótese arquitetural

Interface React + TypeScript + Vite dentro de Tauri 2, com comandos pequenos e tipados para serviços de domínio em Rust. Persistência proposta em SQLite local e arquivos clínicos em diretório privado, com metadados e hashes no banco.

## Restrições vigentes

- Operação local, offline, Windows-first e em um computador.
- Nenhum SQL genérico exposto à WebView.
- Nenhum segredo ou dado de domínio em armazenamento inadequado do frontend.
- Autorização no backend para toda operação.
- Sem backend remoto ou sincronização no escopo inicial.

## Lacunas

- Resultado do spike técnico e de segurança.
- Fronteiras de módulos e contratos IPC.
- Estratégia aprovada de criptografia e segredos locais.
- Modelo de dados e migrações.
- Empacotamento, assinatura, atualização e diagnóstico.
- Backup, restauração e exportação verificáveis.
