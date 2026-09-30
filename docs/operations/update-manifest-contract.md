# Contrato do manifesto de atualização

**Status:** preparação G5; contrato sujeito à validação no spike.

## Manifesto estático

O arquivo latest.json deve conter:

- version em SemVer;
- notes sem dados clínicos;
- pub_date em RFC 3339;
- platforms.windows-x86_64;
- platforms.windows-x86_64.url em HTTPS;
- platforms.windows-x86_64.signature com o conteúdo da assinatura, nunca apenas o caminho do arquivo;
- checksum SHA-256 publicado como metadado complementar.

O artefato de atualização do Windows será o pacote produzido pelo Tauri/NSIS para o updater, acompanhado da assinatura correspondente. O instalador comum e o pacote do updater não devem ser confundidos.

## Canais

- piloto: manifesto do repositório de artefatos do piloto, com versões SemVer pré-release, por exemplo 0.1.0-pilot.15;
- estável: manifesto promovido após G7, com versão SemVer estável, por exemplo 0.1.0;
- a instalação piloto nunca deve apontar para o manifesto estável;
- a promoção estável deve ser explícita e auditável.

## Regras

- endpoint sempre HTTPS;
- manifesto inválido ou incompleto é rejeitado;
- versão menor ou igual à atual não é instalada;
- notas descrevem comportamento, correções e necessidade de reinício sem revelar dados;
- URLs e nomes de arquivo não contêm CPF, nome de paciente ou informação clínica;
- o manifesto não contém token ou credencial.

A estrutura final deve ser validada contra a documentação da versão do Tauri Updater escolhida antes da implementação.