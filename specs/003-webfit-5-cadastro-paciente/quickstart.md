# Quickstart: WEBFIT-5

Execucao futura somente ficticia; nenhum teste de produto executado neste planejamento.

## Checks existentes

Raiz: `npm run format:check`, `npm run check` (lint, TypeScript, testes Node e build).

src-tauri: `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`, `cargo test` (integracao SQLCipher/backup). Build Tauri aplicavel conforme politica vigente; nao gerar/publicar instalador por iniciativa do agente. Registrar resultados reais; nao instalar dependencias.

## Aceite

1. TA-PAT-008/009: dois pacientes somente nome/nascimento/sexo; reabrir depois de reiniciar.
2. TA-PAT-010/011: omitir cada obrigatorio; data futura, sexo invalido por comando, CPF invalido/duplicado inclusive arquivado e e-mail preenchido invalido; preservar digitado.
3. TA-PAT-012: mouse/teclado, foco, selecao exclusiva, sem default.
4. TA-PAT-013/015/016: editar retirando CPF/contato; preservar ID/historico. Legado vazio/arbitrario preservado ate escolher. Responsavel parcial conforme validacao humana.
5. TA-PAT-014: banco vazio/v1 populada/idempotencia; comparar IDs/payloads/tags/prescricoes/auditoria; foreign_keys ON, integridade, rollback e snapshot pre-migracao recuperavel.
6. TA-PAT-014: restaurar backups v1/v2 incluindo varios CPFs ausentes. Metadata divergente/futura, senha incorreta, corrupcao e falha de import preservam estado; sucesso mantem trilhas e bloqueia sessao.

## Entrega

Converge, Verification/Review independentes, Security/UI gates, evidencia e aceite Windows. Frontend isolado nao comprova Tauri integrado; planejamento nao e implementacao.
