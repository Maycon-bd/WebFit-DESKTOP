# Contract: WEBFIT-5

Manter save_patient existente, com autenticacao/autorizacao no backend Tauri; sem SQL generico na WebView.

## Entrada

ID opcional para novo e existente para edicao. Patient com name/birth/sex obrigatorios, sexo canonico F/M. CPF/contato ausentes ou vazios permitidos; normalizar CPF preenchido. Guardian conforme D-PAT-001. Preservar legado/rascunho ate salvar. Rejeitar sexo arbitrario em comando direto.

## Saida / erro

Sucesso retorna UUID, salva atomicamente e audita conforme contrato existente. Erro de obrigatorio, CPF/e-mail invalido ou CPF duplicado preserva formulario; nenhum valor sensivel em logs. Mensagem identifica campo sexo.

## Interface

Sexo em fieldset/legend, radios Feminino/Masculino de mesmo name, labels clicaveis, foco visivel e teclado. Sem default. Somente nome/nascimento/sexo required; opcionais identificados consistentemente. Responsavel/legado dependem de D-PAT-001/002.

## Compatibilidade

Lista, busca, mascaramento e rascunhos toleram CPF vazio. Backup v1/v2 segue data-model.md; criptografia/auditoria preservadas. Fixtures de novos salvamentos recebem sexo ficticio explicito; fixtures de legado mantem payload original.
