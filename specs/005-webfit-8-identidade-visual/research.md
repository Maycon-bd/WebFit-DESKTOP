# Research — WEBFIT-8

- **Decision**: PNG escolhido e derivados pelo CLI local `tauri icon`. **Rationale**: preserva desenho e gera tamanhos sem dependência. **Alternatives considered**: redesenhar SVG mudaria identidade; conversor adicional desnecessário. Detalhe interno AUTO, reversível.
- **Decision**: substituir wordmarks, incluir Sobre/favicon; preservar ações e logo profissional. **Rationale**: pedido de marca do sistema e RN-CLI-003. **Alternatives considered**: inserir em todos os botões/documentos clínicos ampliaria escopo.
- **Evidence**: CLI help local, bundle.icon, duas wordmarks e LoginInfo. Confirmar propriedades NSIS no schema instalado e build.
- Sem lacunas materiais ou ADR novo.
