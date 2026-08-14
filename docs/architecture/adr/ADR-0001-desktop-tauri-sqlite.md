# ADR-0001 — Desktop local com Tauri, Rust e SQLite

- **Status:** proposto para validação por spike
- **Data:** 2026-08-13
- **Decisores:** responsável pelo produto e responsável técnico — nomes pendentes
- **Decisões relacionadas:** DEC-003, DEC-004, DEC-005 e DEC-006

## Contexto

O produto pretende operar localmente, offline, inicialmente no Windows e em um único computador, sem serviço de hospedagem obrigatório. Ele tratará dados de saúde, arquivos clínicos e rotinas que exigem persistência, autorização, auditoria, backup e restauração.

O WebFit Web é referência de comportamento e interface, mas sua arquitetura remota e seus mecanismos de persistência não serão adotados automaticamente.

## Proposta

Validar por spike a seguinte composição:

- Tauri 2 como shell e empacotamento desktop;
- React + TypeScript + Vite na interface;
- Rust como fronteira de comandos, domínio, autorização, arquivos e persistência;
- SQLite nativo para dados locais;
- arquivos clínicos no filesystem privado, com metadados e hashes no banco;
- comandos pequenos e tipados, sem ponte SQL genérica para a WebView.

Esta seção é uma hipótese técnica autorizada para teste, não uma decisão de produção comprovada.

## Forças e restrições

- Funcionamento offline após a instalação.
- Instalação e uso Windows sem ferramentas de desenvolvimento.
- Persistência consistente após fechar e reabrir.
- Proteção adequada de banco, chaves, arquivos e backups.
- Uso em um único computador; SQLite em rede ou pasta sincronizada não é suportado.
- Backup e restauração são capacidades do produto.

## Alternativas que o spike deve comparar

| Alternativa | Situação atual | Questão a validar |
|---|---|---|
| Tauri + Rust + SQLite | proposta principal | atende empacotamento, segurança, manutenção e recuperação? |
| Outro shell desktop com banco embarcado | não avaliada | existe opção com melhor risco/custo para as restrições? |
| Backend remoto e banco servidor | fora do escopo inicial | torna-se necessário se surgirem múltiplos computadores, acesso remoto ou sincronização? |

O spike deve documentar critérios e evidências suficientes para evitar uma comparação apenas opinativa.

## Critérios mínimos do spike

- Gerar e instalar pacote Windows em ambiente limpo.
- Criar e migrar SQLite em diretório correto por usuário.
- Gravar um registro de teste, fechar, reabrir e verificar persistência.
- Demonstrar comandos tipados sem SQL genérico exposto ao frontend.
- Verificar foreign keys, transações, migração do banco vazio e diagnóstico de integridade.
- Avaliar SQLCipher, armazenamento de chaves e alternativa caso a combinação não seja viável.
- Criar snapshot consistente, verificar checksums e restaurar em instalação de teste.
- Testar caminhos com acentos, falha de permissão e falta de espaço.
- Registrar versões, ambiente, comandos, resultados, limitações e riscos residuais.

As metas mensuráveis de desempenho, tamanho e tempos de recuperação ainda precisam ser aprovadas antes do spike.

## Resultado possível

- **Aceitar:** critérios atendidos e riscos residuais aceitos formalmente.
- **Revisar:** composição parcialmente viável; atualizar proposta e repetir testes afetados.
- **Rejeitar:** risco ou restrição bloqueante; registrar ADR substituta.

## Consequências se aceita

- O frontend não acessará banco ou filesystem diretamente.
- Regras, autorização e persistência ficarão atrás de comandos Rust tipados.
- Migrações, backup/restauração e proteção de dados serão partes obrigatórias da fundação.
- Necessidade de colaboração remota reabrirá a decisão arquitetural.

## Evidências

Ainda não existem. Preencher após o spike com links para plano, resultados, testes e riscos atualizados.
