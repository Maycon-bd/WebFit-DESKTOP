# Plano de testes — primeiro incremento

**Status:** planejado; execução depende do spike e da implementação.

| Grupo | Escopo | Evidência esperada |
|---|---|---|
| Frontend | fluxos diretos, formulários, validação, estados e teclado | relatório de testes e inspeção |
| Rust | autenticação, autorização, regras e erros | `cargo test` |
| SQLite | migrações, constraints, pesquisa e persistência | testes com banco temporário |
| Segurança | hash, espera, sessão, logs e arquivos privados | testes negativos e varredura |
| Backup | snapshot, manifesto, checksum, rotação e restauração | pacotes fictícios e relatório |
| Falhas | corrupção, disco cheio, permissão e interrupção | resultado sem perda do estado atual |
| Desempenho | RNF-DES-001 a 003 com 2.400 pacientes | métricas e configuração da máquina |
| Acessibilidade | teclado e ampliação de 200% | checklist e capturas/evidência |
| Aceite | TA-AUT, TA-CLI, TA-PAT, TA-AUD e TA-BKP | ata da Sprint Review |

Antes do Gate G5, executar formatação, lint, TypeScript, testes frontend, Rust, SQLite e build Tauri disponíveis. Ausências de comandos devem ser tratadas na fundação.
