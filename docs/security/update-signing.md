# Política de assinatura do updater

**Status:** preparação G5; nenhuma chave foi gerada.

## Separação de chaves

- A chave pública do updater fica incorporada na configuração do aplicativo e pode ser distribuída.
- A chave privada assina os artefatos e nunca entra no repositório, no aplicativo, no repositório público de releases ou em logs.
- A assinatura do Tauri protege a atualização; ela é diferente da assinatura de código reconhecida pelo Windows.
- Um certificado Windows local é opcional e não substitui a assinatura obrigatória do updater.

## Custódia

- Gerar a chave somente após aprovação sensível e em ambiente controlado.
- Armazenar a chave privada como segredo do pipeline e manter uma cópia de recuperação offline, protegida por credencial separada.
- Testar a recuperação da chave sem expor seu conteúdo.
- Registrar somente identificador, data de criação, estado e procedimento; nunca registrar o segredo.

## Operação

- O pipeline falha fechado quando a chave está ausente, a assinatura não corresponde ou o manifesto contém assinatura incompatível.
- O aplicativo rejeita pacote com assinatura inválida antes da instalação.
- Rotação exige nova versão do aplicativo com nova chave pública e plano de transição; não é uma troca silenciosa.
- Comprometimento ou perda da chave exige interromper a publicação e preparar migração controlada para uma nova identidade.

## Critérios de aceite

- chave privada ausente do Git e dos artefatos públicos;
- assinatura inválida rejeitada pelo aplicativo;
- logs e evidências sem segredo;
- procedimento de recuperação documentado e testado com chave fictícia;
- revisão humana antes da geração da chave de uso.