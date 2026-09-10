# Planejamento futuro — arquivos e documentos

**Data:** 2026-09-10  
**Estado:** proposta registrada para descoberta futura  
**Impacto no incremento 1:** nenhum

## Objetivo

Disponibilizar no WebFit Desktop um local privado e pesquisável para guardar PDFs e imagens. O módulo terá uma única infraestrutura técnica e duas áreas funcionais claramente separadas:

1. **Arquivos do paciente:** documentos clínicos vinculados a um paciente, como exames, laudos, fotos de acompanhamento e documentos recebidos.
2. **Biblioteca profissional:** documentos da própria nutricionista sem vínculo obrigatório com paciente, como materiais de referência, modelos e documentação profissional.

Arquivos de paciente permanecem previstos no MVP Saúde em incremento posterior. A biblioteca profissional é uma evolução posterior ao núcleo do MVP e não bloqueia os Gates G2 a G7 do primeiro incremento.

## Entrega inicial planejada

- importar PDF, JPG, JPEG e PNG;
- pesquisar por nome original, paciente quando houver vínculo, categoria, tags, tipo e intervalo de datas;
- listar separadamente arquivos de pacientes e documentos profissionais;
- visualizar PDF e imagem dentro do aplicativo quando o formato for suportado;
- abrir ou exportar uma cópia do arquivo original mediante ação explícita;
- arquivar e restaurar sem exclusão física;
- registrar nome original, tipo detectado, tamanho, hash, autor, datas, escopo e vínculo opcional com paciente;
- detectar arquivo ausente ou cujo hash não corresponda ao metadado;
- incluir arquivos, metadados e checksums no backup e na restauração;
- auditar importação, visualização, abertura externa, exportação, arquivamento e restauração.

## Busca

A primeira versão pesquisa somente metadados controlados pelo sistema. Nome, categoria e tags podem ser combinados com paciente, tipo e período. A pesquisa deve ignorar caixa e acentos onde aplicável, sem revelar documentos de outro usuário ou espaço não autorizado.

OCR, indexação do conteúdo interno e classificação automática ficam fora da primeira versão. Essa separação reduz complexidade, consumo de recursos e risco de extrair conteúdo clínico sensível sem necessidade.

## Armazenamento e integridade

- arquivos físicos ficam em diretório privado controlado pelo backend;
- o nome físico é um UUID sem nome, CPF ou dado clínico;
- o SQLite guarda metadados, vínculos, tags, estado e hash, não o arquivo grande como BLOB por padrão;
- tipo deve ser validado pelo conteúdo e não somente pela extensão;
- importação usa escrita temporária, cálculo de hash e publicação atômica;
- falha de banco, arquivo ou auditoria não pode deixar registro órfão nem informar sucesso;
- backup e restauração tratam banco e arquivos como um conjunto consistente.

## Segurança e privacidade

- toda operação passa por comando Tauri pequeno, tipado e autorizado;
- documentos clínicos e profissionais são tratados como privados;
- no MVP, nutricionista e administrador seguem a política de acesso aprovada para o espaço, com ações auditadas;
- caminhos físicos internos não são expostos à interface;
- logs nunca contêm nome do arquivo, CPF, conteúdo, miniatura ou caminho privado;
- exportação exige escolha explícita de destino;
- não haverá exclusão definitiva até aprovação de política legal de retenção e fluxo de recuperação.

## Requisitos propostos

| ID | Resultado | Estado |
|---|---|---|
| RF-ARQ-001 | importar, consultar, visualizar, arquivar, restaurar e exportar arquivo clínico vinculado a paciente | proposto — incremento 4A |
| RF-ARQ-002 | manter biblioteca profissional independente de paciente | proposto — evolução posterior |
| RF-ARQ-003 | pesquisar arquivos dos dois escopos por metadados autorizados | proposto — infraestrutura compartilhada |

## Regras candidatas

| ID | Regra | Estado |
|---|---|---|
| RN-ARQ-001 | cada arquivo pertence ao espaço Saúde e ao escopo paciente ou profissional; vínculo com paciente é obrigatório somente no primeiro escopo | proposta |
| RN-ARQ-002 | arquivo físico usa UUID; nome original existe somente como metadado protegido | proposta |
| RN-ARQ-003 | PDF, JPG, JPEG e PNG são os formatos iniciais; assinatura real do conteúdo deve corresponder ao tipo permitido | proposta |
| RN-ARQ-004 | hash é calculado na importação e verificado no backup, restauração e diagnóstico de integridade | proposta |
| RN-ARQ-005 | busca inicial usa metadados; OCR e busca no conteúdo ficam fora da primeira versão | proposta |
| RN-ARQ-006 | arquivar não exclui o arquivo e exclusão definitiva permanece indisponível até política legal aprovada | proposta |
| RN-ARQ-007 | exportação cria cópia no destino escolhido e nunca move o original privado | proposta |
| RN-ARQ-008 | banco, arquivo e auditoria formam uma operação consistente; falha não deixa item órfão | proposta |
| RN-ARQ-009 | pacote de backup inclui arquivos privados, metadados, manifesto e checksums correspondentes | proposta |

## Critérios de aceite preliminares

| ID | Cenário esperado | Estado |
|---|---|---|
| TA-ARQ-001 | importar PDF e imagem válidos, reiniciar e reencontrar arquivo, metadados e vínculo | proposto |
| TA-ARQ-002 | rejeitar tipo não permitido, extensão falsa e arquivo acima do limite sem deixar resíduo | proposto |
| TA-ARQ-003 | combinar filtros de nome, paciente, categoria, tags, tipo e data sem acessar outro escopo não autorizado | proposto |
| TA-ARQ-004 | visualizar formato suportado e exportar cópia idêntica ao original, confirmada pelo hash | proposto |
| TA-ARQ-005 | arquivar e restaurar preservando arquivo, vínculo, metadados e histórico | proposto |
| TA-ARQ-006 | detectar arquivo ausente ou alterado e impedir falsa confirmação de integridade | proposto |
| TA-ARQ-007 | criar e restaurar backup contendo banco e arquivos com checksums correspondentes | proposto |
| TA-ARQ-008 | simular falha de banco, filesystem e auditoria sem produzir item órfão nem sucesso falso | proposto |
| TA-ARQ-009 | confirmar auditoria segura sem nome de arquivo, conteúdo clínico ou caminho privado nos logs | proposto |

## Fora da primeira versão do módulo

- OCR e busca no conteúdo;
- classificação automática por inteligência artificial;
- edição de imagens, PDFs ou documentos;
- compartilhamento remoto, nuvem ou sincronização;
- envio automático ao paciente;
- versionamento colaborativo;
- exclusão definitiva.

## Decisões necessárias na descoberta

1. limite máximo por arquivo e capacidade total esperada;
2. categorias e tags iniciais de cada escopo;
3. política de arquivos duplicados pelo mesmo hash;
4. miniaturas persistidas ou geradas sob demanda;
5. formatos adicionais, como DOCX, somente após avaliação de segurança e visualização;
6. política legal de retenção e eliminação;
7. ordem da biblioteca profissional em relação aos demais incrementos posteriores.
