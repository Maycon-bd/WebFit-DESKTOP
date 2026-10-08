# ADR-0003 — Ativação offline e suporte por instalação

- Status: **proposto**; direção funcional aprovada na DEC-058, protocolo técnico/custódia e efeitos de transição pendentes. Não representar este ADR como aceito.
- Data: 2026-10-08. Responsável técnico: Maycon. Demanda: [WEBFIT-10](../../../specs/WEBFIT-10/task.md).
- Relacionados: ADR-0001, ADR-0002, RF-LIC-001..005, RN-LIC-001..007. RF-LIC-006/RN-LIC-008 adiados para outra demanda por Maycon.

## Contexto e alternativas

A preparação atual permite escolher administrador em banco vazio. Maycon precisa emitir autorizações e manter acesso administrativo próprio por instalação; suporte deve operar cópia protegida, preservando operação offline.

1. Preparação manual com senha por instalação: simples, mas não restringe emissão/preparação livre.
2. Solicitação e licença assinada vinculada à instalação: atende operação offline, sem servidor; exige emissor/custódia, persistência de consumo e limites explícitos de clonagem/revogação.
3. Ativação central online: permite controlar resgate global e revogação quando conectado, mas adiciona serviço/custo/disponibilidade; não selecionada para esta demanda.

## Direção funcional aprovada e desenho proposto

Maycon aprovou solicitação local → emissão manual → importação/validação → preparação, e os cinco tipos. Implementar validação no backend Rust; nenhum comando de preparação pode contornar a licença pelo IPC. Definir identificador da licença, tipo, versão de protocolo, identificador da solicitação/destino, emissor e vínculo autenticados pela assinatura. Solicitação sem dados clínicos/CPF/senhas. Versão incompatível, assinatura inválida ou destino divergente não produz efeitos.

Proposta: identidade criptográfica aleatória por instalação protegida localmente, evitando vínculo silencioso a CPF ou fingerprint de hardware. Protocolo deve definir prova de posse, canonicalização/bytes assinados, limites de arquivo e importação atômica. Algoritmo, biblioteca, formato definitivo e schema ainda não selecionados/aprovados. Não implementar criptografia própria nem embutir segredo de descriptografia compartilhado.

Credencial administrativa permanece senha específica por instalação conferida por Argon2; autorização não transporta senha recuperável. Proposta de payload com login/verificador, assinado e cifrado para o destinatário, depende de análise técnica. Emissor mantém chave privada separada do updater e fora do instalador clínico; somente chave pública de verificação acompanha aplicativo. Gerar/guardar credenciais no cofre humano não significa integrar Bitwarden. Antes de operar: definir custódia, cópia protegida, perda/comprometimento/rotação das chaves e procedimento de recuperação.

Consumo é local por autorização/operação; reimportação não executa efeito de novo. Falha/interrupção não deixa preparação parcial nem consome irreversivelmente uma autorização sem operação concluída. Suporte temporário é autorização de sessão, não cópia do banco. Transferência exige licença destinada ao novo ambiente e backup validado; restauração não deve copiar identidade/chave privada da instalação de origem nem reabrir autorizações consumidas. Esses contratos serão fechados no Plan.

Reinicialização é separada de ativação: backup válido/confirmacão explícita; limpa consultório mantendo licença/acessos/consumo conforme resposta de Maycon. Atualização/reparo preservam dados/licença. Ativações iniciais (anteriores eram testes), emissor com interface e suporte uma sessão até 4 h encerrada ao sair/bloquear aprovados. Bancos não são apagados automaticamente. Consumo/relógio offline precisam de desenho. Pacote para suporte por cópia adiado para outra demanda, sem implementar nesta entrega.

## Limites e riscos

- Sem servidor não há garantia global de uso único, revogação/desativação remota, nem prova absoluta de que uma cópia antiga deixou de funcionar.
- Clone integral, rollback de disco/backup, alteração do relógio e administrador do Windows modificando o programa exigem threat model e limites comunicados; assinatura não impede todos esses ataques.
- Restringir emissão administrativa não modifica por inferência o acesso total aprovado da nutricionista ao Saúde.
- Abrir arquivo SQLCipher fora da instalação requer recuperar a chave; senha administrativa/licença não substituem o pacote criptografado de backup/suporte.
- Retornar um banco inteiro pode eliminar trabalho posterior ao snapshot. Não permitir retorno automático sem política de concorrência e recuperação definida.

## Evidências e critérios para fechar o desenho

Inspeção: `src-tauri/src/service.rs` (Setup, abertura e credenciais), `security.rs` (Argon2/DPAPI), `recovery.rs` (snapshot e importação de usuários). Fontes oficiais: [DPAPI](https://learn.microsoft.com/en-us/windows/win32/SecCrypto/example-c-program-using-cryptprotectdata), [assinaturas públicas](https://doc.libsodium.org/public-key_cryptography/public-key_signatures), [snapshot SQLite](https://www.sqlite.org/backup.html). Libsodium é referência conceitual, não dependência escolhida.

D-LIC-001..005 respondidas por Maycon; protocolar custódia/perda/rotação, instalação/restauração/consumo e compatibilidade; avaliar migração/dependências e autorização específica; testar TA-LIC-001..011 aplicáveis em dados fictícios e review independente. TA-LIC-012 adiado. Aceite arquitetural humano não autoriza banco real, publicação ou G7.
