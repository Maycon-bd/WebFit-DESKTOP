# Quickstart — WEBFIT-9

Pré-requisitos: dependências existentes e dados fictícios.

1. npm run format:check e npm run check: login, TTL, foco, erro, sessão, cleanup e pausa.
2. cargo fmt --manifest-path src-tauri/Cargo.toml --check; cargo clippy --locked --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings; cargo test --locked --manifest-path src-tauri/Cargo.toml: inclui SQLite/backup/updater existentes.
3. npm run dev com fixture: faixa global na lista/formulário, foco preservado, Atualizar bloqueado na edição, detalhes/adiar/progresso/erro. Janela larga/estreita e zoom 200% sem corte; scroll abaixo da faixa e lateral recolhível.
4. Após integração/publicação humanas: Windows instalado, versão fictícia publicada durante sessão, detecção após intervalo/retorno e ensaio confirmação/backup/assinatura/reinício. Fixtures locais não certificam distribuição.
