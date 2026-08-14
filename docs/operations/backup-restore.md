# Backup e restauração

**Status:** capacidade obrigatória candidata; desenho e política pendentes.

## Princípios a validar

- Snapshot consistente do banco ativo.
- Banco e arquivos no mesmo pacote, com manifesto e checksums.
- Restauração primeiro em área temporária.
- Validação de versão, integridade, relacionamentos, hashes e espaço livre.
- Backup de segurança do estado atual antes da troca.
- Teste de restauração em instalação limpa antes de dados reais.

## Decisões pendentes

- RPO, RTO, frequência e retenção.
- Destinos suportados e detecção de caminhos inadequados.
- Criptografia, senha/chave e recuperação.
- Automação, lembretes e responsabilidade do operador.
- Política diante de falha, pacote incompatível ou corrupção.
