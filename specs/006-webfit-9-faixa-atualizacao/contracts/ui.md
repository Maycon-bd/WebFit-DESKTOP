# UI Contract — WEBFIT-9

Faixa somente após versão disponível, abaixo do título nativo, antes de toda navegação/conteúdo. Texto: “Nova atualização disponível. Salve o que estiver fazendo antes de atualizar. O aplicativo será reiniciado.” Atualizar à direita; Mais tarde adia versão. Detalhes da atualização expande versão/notas. Texto/progresso/erro anunciados sem roubar foco. Durante instalação não adiar nem consultar. Botão desabilitado quando blocked ou installing, com motivo visível.

IPC check_update(token) -> {version,notes}|null e install_update(token,version) intactos, com autorização backend. Eventos update-progress/update-installing intactos. Nenhum dado de domínio enviado à consulta.
