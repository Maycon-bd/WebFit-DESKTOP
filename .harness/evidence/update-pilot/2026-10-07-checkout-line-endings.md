# Formatação no checkout Windows — 2026-10-07

RF-UPD-001 / DEC-053 / T113. Correção LIGHT técnica, sem mudança funcional ou integração nova; reutiliza a demanda do pipeline, sem novo Spec Kit/Plane. Branch observada feature/pbi-001-primeiro-incremento-saude, HEAD 210d11d884626e15c8992b6ba050496432fb5f08 e upstream local coincidente. Árvore inicialmente limpa; divergência do checkpoint main informada antes das edições. Nenhuma operação Git mutável pelo agente.

## Causa e correção

Log fornecido por Maycon: bootstrap/dependências/testes de release avançaram; Prettier falhou em 26 arquivos. Reproduzido localmente em cinco arquivos: todos têm índice LF e checkout CRLF, exatamente os cinco avisos de format:check. core.autocrlf=true e ausência de .gitattributes permitiam conversão no checkout do runner Windows.

.gitattributes agora declara text=auto e eol=lf, com exceção CRLF para .bat/.cmd. Detecção automática preserva binários. npm run format normalizou os arquivos locais; nenhum diff de conteúdo de produto apareceu contra o índice, confirmando apenas finais de linha. Guia e checkpoint atualizados. A validação do pipeline permanece ativa.

## Verificação

- npm run format:check: PASS, todos os arquivos correspondem ao Prettier.
- git check-attr: LF para TSX/JSON/MJS; CRLF para extensão cmd.
- git diff: sem diff de conteúdo de produto após normalização; arquivos podem aparecer como modificados por metadados/finais de linha até a revisão Git humana.

Checks limitados à causa de formatação; testes funcionais/build não repetidos porque não houve mudança de lógica. Um checkout novo no runner, após integração humana da regra, ainda precisa confirmar o format:check remoto e as etapas seguintes. G5 em execução; nenhuma release/publicação/aceite integrado declarado.
