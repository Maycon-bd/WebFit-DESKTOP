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

## Complemento — checkout reutilizado do runner

Após Maycon informar que já executou e não havia mudanças para enviar, a inspeção somente leitura confirmou o problema no checkout real C:/actions-runner/_work/WebFit-DESKTOP/WebFit-DESKTOP. Runner e workspace possuem HEAD c4526f5384f4a479edf52ee589d98854614428c0, com .gitattributes integrado. Porém git ls-files --eol no runner mostra i/lf e w/crlf para package.json, src/App.tsx e src/api.ts; check-attr aponta eol=lf. O último Worker_20261007-202056-utc.log confirma falha na etapa Verify frontend format. Nenhum segredo ou conteúdo de credencial do log foi consultado/exposto; somente resultado da etapa. Leitura Git no checkout exigiu execução fora do sandbox, sem mutação nem mudança de configuração persistente.

Conclusão: a regra nova de atributos não reescreveu arquivos inalterados do checkout reaproveitado. A resposta anterior, limitada à validação local, não comprovava resolução no runner.

Correção LIGHT: .prettierrc.json define endOfLine=auto. .gitattributes continua definindo LF no repositório; Prettier aceita LF/CRLF uniformes por arquivo e continua validando estilo. Nenhum workflow, Git do runner, produto, dependência, versão ou esquema alterado. Preferível a apagar/recriar checkout ou remover etapa de qualidade. Não requer nova Specification/Plane porque não muda comportamento do produto nem integração.

Verificação: todos os alvos do format:check no checkout real do runner passaram usando o Prettier instalado e a nova configuração explícita, em modo somente leitura. npm run format:check local também passou. Controle negativo CRLF com const   value=1; foi rejeitado com exit 1, confirmando que o estilo continua obrigatório. Fixture isolada em .artifacts/prettier-eol-check, sem teste artificial versionado. Checks funcionais/Rust/build não repetidos: produto inalterado, mudança limitada ao formatter.

Branch observada main, HEAD c4526f5384f4a479edf52ee589d98854614428c0, árvore inicialmente limpa. Nenhuma criação/troca de branch, commit/push, dispatch/re-run, publicação ou alteração do checkout externo. Maycon envia a nova configuração; execução integrada posterior deve confirmar avanço e eventuais falhas das etapas seguintes. G5/G6/G7 não concluídos por esta correção.
