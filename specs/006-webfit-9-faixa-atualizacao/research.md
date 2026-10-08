# Research — WEBFIT-9

Pesquisa delegada updater_research, somente leitura, 2026-10-08; confirmação local pelo implementador.

- Decision: repetir check_update existente; Rationale: autoriza sessão sem renovar inatividade, timeout 15s e nenhuma escrita; Alternatives: endpoint novo/push exigiriam infraestrutura. Fontes: src-tauri/src/update.rs, service.rs e https://v2.tauri.app/plugin/updater/.
- Decision: TTL e in-flight com relógio injetável; Rationale: StrictMode, foco duplicado e retry offline; Alternatives: intervalo sem deduplicação e cache diário.
- Decision: subscription com cleanup de timers/focus/visibility e guarda active; Rationale: impedir entrega após logout. Não usar task na consulta, preservar blocked da instalação.
- D-UPD9-001: cooldown de um minuto e adiar versão somente por sessão, AGENT-PROVISIONAL; alta confiança, baixo impacto/risco, reversível. Validação humana no aceite final. Evita rajadas/reabertura da mesma versão; nova versão/login pode avisar.
- Decision: faixa global com detalhes sob demanda; Rationale: notas consultáveis sem expansão inicial, mantendo cores/copy da interface.
