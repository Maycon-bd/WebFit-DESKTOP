# Contrato — WEBFIT-5

`save_patient` preserva autenticação/autorização no backend Tauri. Sem SQL genérico na WebView.

## Entrada

ID do comando ausente para criar ou UUID existente para editar. Patient exige name/birth/sex F/M; CPF/contato/responsável opcionais. CPF/e-mail preenchidos validados. Campos internalNumber/id no payload nunca controlam identidade ou numeração. Radios sem default; desconhecido exige escolha. Rascunho/legado preservados até Salvar.

## Saída e erro

Sucesso retorna `{ id: UUID, internalNumber: inteiro positivo }`, grava/audita atomicamente. Patient/Patients retornam número da coluna confiável, sem zeros; lista mascara CPF informado, vazio permanece vazio para “Não informado”. Pesquisa por número exato ou texto existente. Erros de obrigatório, data, sexo, CPF/e-mail inválido e CPF duplicado mantêm formulário. Sem logs sensíveis.

## Compatibilidade

Migração003/schema3; bancos instalados anteriores exigem snapshot cifrado validado. Backup1/2/3 conforme [modelo](../data-model.md), com criptografia, licença e auditoria preservadas. Fixtures de novos cadastros têm sexo explícito; legado é testado sem reescrita. [Aceite e decisões](../spec.md).
