# Contract: Operações autorizadas

**Status**: contrato conceitual de segurança para o design; não é API implementada.

## Boundary

A interface solicita operações nomeadas e tipadas. A fronteira confiável valida sessão, papel, espaço, entrada, regra de domínio e auditoria antes de alterar ou retornar dados. A interface não acessa banco, filesystem, segredos ou SQL genérico diretamente.

## Operation groups

| Grupo | Operações | Resultado mínimo |
|---|---|---|
| Identidade | preparar usuários, autenticar, logout, trocar senha, reset administrativo | sucesso explícito ou erro seguro; login/reset geram auditoria |
| Perfil | consultar e salvar perfil | dados autorizados; alteração de recurso privado gera auditoria |
| Pacientes | criar, consultar, pesquisar, editar, arquivar, restaurar | validação completa; CPF mascarado em lista; auditoria |
| Tags | criar, atribuir, renomear, desativar | histórico preservado; auditoria |
| Rascunhos | salvar, listar, recuperar, descartar | somente usuário/espaço atuais; falha não simula sucesso |
| Prescrições | criar, salvar rascunho, calcular, finalizar, versionar, cancelar | paciente ativo; versão final imutável; auditoria |
| Auditoria | abrir módulo, listar, filtrar, paginar, abrir detalhe | somente metadados permitidos; sem editar/excluir/exportar |
| Backup | criar, consultar estado, validar, restaurar | snapshot, checksums, confirmação e preservação do estado atual |

## Error contract

- Erro de validação informa o campo e a regra sem revelar segredo ou dado sensível.
- Erro de autenticação não informa qual credencial falhou.
- Erro de autorização não retorna metadados do recurso protegido.
- Falha de auditoria impede operação crítica ou login bem-sucedido.
- Falha de consulta de auditoria não pode ser convertida em lista vazia.
- Falha de backup não publica pacote parcial nem rotaciona o último válido.
- Falha de restauração não altera o estado atual.
- Diagnósticos técnicos devem ser seguros para interface e logs.

## Audit contract

Cada operação crítica define se exige evento antes da conclusão. O evento contém ator, instante UTC, espaço, ação, entidade e resultado permitidos, sem conteúdo clínico. A representação de ator e a semântica de cursor aguardam validação de D-AUTO-001/D-AUTO-002.

## Non-goals

Nenhuma operação de Educação, sincronização, colaboração em rede, nuvem, exportação ou impressão é exposta por este contrato.