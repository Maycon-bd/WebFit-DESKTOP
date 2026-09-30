# ADR-0001 — Desktop local com Tauri, Rust e SQLite

- **Status:** aceito em 2026-09-21 após conclusão e aprovação humana do G4
- **Data:** 2026-08-13; decisão final em 2026-09-21
- **Decisores:** Amanda — aprovadora funcional; Maycon — Product Owner e responsável técnico
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

A composição foi inicialmente autorizada como hipótese de spike e, após as evidências do G4 e a aprovação de Maycon em 2026-09-21, tornou-se a direção arquitetural aceita para a fundação de produção. A implementação continua condicionada ao G5, aos requisitos aprovados e às tarefas do Spec Kit.

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

Evidência consolidada em [g4-spike-2026-09-17.md](../../../.harness/evidence/g4-spike-2026-09-17.md): shell Tauri, SQLite embutido, migração, foreign keys, comandos tipados, persistência, backup/restauração, SQLCipher, DPAPI, cenários adversos, CSP, testes, build e instalação/desinstalação NSIS passaram localmente.

**Decisão final: ACEITAR.** Maycon aprovou integralmente em 2026-09-21 a política operacional sem custo recorrente, SQLCipher Community com avisos de licença, chave por instalação protegida por DPAPI `CurrentUser`, backup portátil com credencial de recuperação separada/offline, NSIS e manutenção manual. A aprovação fecha o G4 e autoriza a preparação do G5, mas não substitui a aprovação de implementação.

Riscos residuais aceitos: MSI não é instalador primário; assinatura Windows paga está adiada para eventual distribuição pública; avisos LNK4099 do OpenSSL devem ser acompanhados antes do G7; o updater conectado exige ADR separado; e nenhuma versão com dados reais será usada antes do G7.
