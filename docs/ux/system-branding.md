# Identidade visual do WebFit Desktop

**Status:** aplicação local autorizada por Maycon, 2026-10-08; RF-UX-004/DEC-056/WEBFIT-8. Aceite visual da instalação separado.

Símbolo escolhido: figura humana/folhas em azul-petróleo e verde, sem texto e com fundo transparente. Fonte: [PNG](../../public/brand/webfit-icon.png), 1254×1254 RGBA. Gerado pelo ImageGen integrado neste chat; prompt de edição: manter símbolo da logo, remover texto, centralizar em tela quadrada transparente preservando identidade/cor. Derivados convertidos pelo CLI Tauri existente, sem novo desenho.

## Aplicação

- Acesso 112×112, lateral 72×72, informações 64×64; marca isolada substitui wordmarks existentes. Nome continua no título e informações.
- Favicon local; dimensões explícitas/object-fit contain. Alt WebFit Desktop no acesso/lateral e alt vazio no Sobre já identificado por seu título.
- Janela/executável/atalhos usam bundle.icon; NSIS installerIcon/uninstallerIcon; todos apontam para src-tauri/icons/icon.ico.
- No Windows, o setup define explicitamente ICON_BIG para a barra de tarefas/Alt+Tab usando o recurso embutido pelo Tauri. O ícone pequeno do título continua definido pelo runtime. Não depende de arquivo externo e não limpa cache nem altera atalhos existentes.
- Derivados nativos preexistentes regenerados para evitar identidades concorrentes; não habilita plataformas adicionais.
- Logo/assinatura privada profissional, ícones de ações e spike G4 separados.

## Regeneração

Na raiz: `npm run tauri -- icon public/brand/webfit-icon.png --output src-tauri/icons`. Não alterar apenas um derivado. Construir pacote após conversão; preservar versão/identificador e distribuição vigente.

Instalações/atalhos recebem recursos após integração/construção/atualização. Windows pode manter cache; esta alteração não limpa cache ou modifica instalação no host.

## Validação

[Cenários](../../specs/005-webfit-8-identidade-visual/spec.md), [verificação](../../.harness/evidence/webfit-8/verification.md), [evidência](../../.harness/evidence/webfit-8/evidence.md). Review independente/aceite Windows não são inferidos do build.
