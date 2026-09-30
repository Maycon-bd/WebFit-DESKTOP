# Instalação

**Status:** requisitos aprovados; instalador ainda não existe.

## Ambiente-alvo

- Windows 10 x64 no primeiro computador de uso.
- Instalação sem Node, Rust ou ferramentas de desenvolvimento.
- Conta Windows exclusiva da nutricionista.
- Dados e backups locais em diretórios definidos pelo aplicativo e validados no spike.

## Critérios do spike

- instalar, iniciar e desinstalar em ambiente limpo;
- preservar dados durante atualização de teste;
- usar diretório correto por usuário/aplicação;
- funcionar sem internet após instalação;
- testar caminho com espaços e acentos;
- registrar versão, tamanho, permissões e limitações.

Durante G5/G6, merges revisados na `main` publicarão versões piloto assinadas. O aplicativo mostrará um ícone e solicitará confirmação; após a confirmação, backup, download, validação, instalação e reinício serão automáticos. O uso piloto permanecerá em perfil/diretório separado e com dados fictícios ou controlados até o G7. O canal estável será ativado posteriormente. A estratégia está em [update-release-strategy.md](update-release-strategy.md) e no [ADR-0002](../architecture/adr/ADR-0002-atualizacoes-e-distribuicao.md).
