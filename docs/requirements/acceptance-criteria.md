# Critérios e testes de aceite

**Status:** testes de aceite do primeiro incremento aprovados; resultado será preenchido após execução.

| ID | Requisito | Cenário e resultado esperado | Status |
|---|---|---|---|
| TA-AUT-001 | RF-AUT-001 | preparar nutricionista e administrador localmente; reiniciar e confirmar usuários sem senha em claro | aprovado |
| TA-AUT-002 | RF-AUT-002 | autenticar com credencial válida, entrar no Saúde, sair e impedir acesso sem nova autenticação | aprovado |
| TA-AUT-003 | RF-AUT-002 | confirmar esperas progressivas, bloqueio após 1 h e reação ao bloqueio do Windows | aprovado |
| TA-AUT-004 | RF-AUT-003 | administrador redefine senha; antiga não é exibida; temporária exige troca; evento é auditado | aprovado |
| TA-CLI-001 | RF-CLI-001 | validar obrigatórios, salvar perfil, reabrir e confirmar dados; alterar assinatura e verificar auditoria | aprovado |
| TA-CLI-002 | RF-CLI-002 | após login, entrar somente em espaço autorizado; Saúde está disponível e Educação não é simulada | aprovado |
| TA-PAT-001 | RF-PAT-001 | abrir Pacientes, clicar em Novo, preencher e salvar um paciente mínimo válido; reencontrá-lo após reiniciar | aprovado |
| TA-PAT-002 | RF-PAT-001 | rejeitar CPF inválido/duplicado e campos obrigatórios ausentes sem perder dados digitados | aprovado |
| TA-PAT-003 | RF-PAT-002 | localizar por nome, nome social, CPF formatado/não formatado e telefone; mostrar CPF mascarado | aprovado |
| TA-PAT-004 | RF-PAT-003 | cancelar não salva; salvar persiste; ambas as ações têm comportamento e auditoria esperados | aprovado |
| TA-PAT-005 | RF-PAT-004 | arquivar preserva histórico, bloqueia novos registros e restaurar reativa o mesmo prontuário | aprovado |
| TA-PAT-006 | RF-PAT-005 | criar, selecionar, renomear e desativar tag sem romper histórico | aprovado |
| TA-PAT-007 | RF-PAT-006 | interromper cadastro após autosave, autenticar novamente e continuar ou descartar o rascunho | aprovado |
| TA-AUD-001 | RF-AUD-001 | executar eventos críticos e confirmar ator, UTC, espaço, ação e resultado sem conteúdo sensível | aprovado |
| TA-BKP-001 | RF-BKP-001 | criar backup manual com banco, arquivos, manifesto e checksums válidos | aprovado |
| TA-BKP-002 | RF-BKP-001 | simular primeiro uso diário e confirmar um backup automático sem duplicação indevida | aprovado |
| TA-BKP-003 | RF-BKP-002 | restaurar pacote válido em teste e comparar integridade e contagens | aprovado |
| TA-BKP-004 | RF-BKP-002 | rejeitar pacote corrompido/incompatível e preservar o estado atual | aprovado |
| TA-BKP-005 | RF-BKP-003 | exibir sucesso recente, falha imediata e alerta após mais de 24 h sem backup válido | aprovado |

Dados de teste são totalmente fictícios. Evidência, executor, data e resultado serão preenchidos na execução.
