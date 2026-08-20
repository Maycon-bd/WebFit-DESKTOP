# Requisitos não funcionais

**Status:** baseline do primeiro incremento aprovada; proteção criptográfica final depende do spike.

| ID | Requisito mensurável | Condição/limite | Status |
|---|---|---|---|
| RNF-SEG-001 | proteger senhas com algoritmo de derivação forte, salt individual e parâmetros versionados | testes não recuperam texto claro; parâmetros documentados | aprovado |
| RNF-SEG-002 | autorizar toda operação no backend | teste negativo por papel/comando; ocultar botão não conta | aprovado |
| RNF-SEG-003 | impedir dados sensíveis em logs | varredura por senha, CPF, prontuário, mensagem e documento | aprovado |
| RNF-SEG-004 | proteger banco, arquivos, assinatura e backups | estratégia comprovada no spike e chave fora do frontend/repositório | aprovado para spike |
| RNF-PRI-001 | registrar acesso administrativo e clínico relevante | auditoria contém ator, instante UTC, espaço, ação, entidade e resultado | aprovado |
| RNF-DES-001 | abrir a aplicação em até 5 s, com meta de 3 s | início frio no computador-alvo | aprovado |
| RNF-DES-002 | pesquisar e abrir paciente em até 1 s | base com 2.400 pacientes, percentil 95 | aprovado |
| RNF-DES-003 | salvar operação comum em até 2 s | base com 2.400 pacientes, percentil 95 | aprovado |
| RNF-ACE-001 | operar os fluxos principais por teclado | Tab, Shift+Tab, Enter e Esc; foco visível | aprovado |
| RNF-ACE-002 | permanecer funcional com ampliação de 200% | sem perda de conteúdo ou ação em 1366×768 | aprovado |
| RNF-REC-001 | limitar perda de dados a 24 h | backup diário válido | aprovado |
| RNF-REC-002 | restabelecer o trabalho até o próximo dia útil | restauração completa ensaiada | aprovado |
| RNF-REC-003 | detectar backup corrompido antes de substituir dados | checksum e integridade falham de forma segura | aprovado |
| RNF-POR-001 | executar em Windows 10 x64 sem ferramentas de desenvolvimento | instalador testado em ambiente limpo | aprovado |
| RNF-OFF-001 | executar o núcleo Saúde sem internet | testes com rede indisponível | aprovado |
| RNF-CON-001 | preservar dados confirmados após fechar e reabrir | teste de persistência e integridade | aprovado |
| RNF-USA-001 | apresentar formulários com organização visual clara e ações diretas | cadastro de paciente em tela única: Novo, preencher e Salvar | aprovado |
| RNF-DOC-001 | gerar documentos compatíveis com A4 | inspeção em Edge, Chrome e impressão padrão do Windows | proposto |

## Baseline de medição proposta para o spike

- Windows 10 22H2 x64;
- CPU de quatro núcleos;
- 8 GB de RAM;
- SSD;
- tela de 1366×768;
- 2.400 pacientes fictícios.

Se o computador real diferir, registrar a configuração e repetir as medições relevantes.
