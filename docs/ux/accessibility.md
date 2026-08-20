# Acessibilidade

**Status:** baseline do primeiro incremento aprovada.

## Critérios

- Login, seleção de espaço, pesquisa, abertura, cadastro, edição, salvar, cancelar, arquivar, restaurar, backup e logout funcionam sem depender do mouse.
- `Tab` avança, `Shift+Tab` retorna, `Enter` aciona quando apropriado e `Esc` fecha/cancela sem perda silenciosa.
- Ordem de foco acompanha a ordem visual e o foco é sempre visível.
- Ampliação de 200% mantém conteúdo e ações acessíveis em 1366×768.
- Erros identificam o campo e explicam correção; não dependem apenas de cor.
- Controles possuem nome acessível e estados de carregamento/sucesso/erro são anunciáveis.
- O formulário único de cadastro mantém seções e rótulos claros, ordem de foco coerente e ações Novo, Salvar e Cancelar acessíveis por teclado.

## Validação

- testes automatizados de semântica onde aplicável;
- revisão manual somente por teclado;
- inspeção em 100%, 150% e 200%;
- teste no WebView2/Windows do computador-alvo;
- registro de evidências nos testes relacionados.
