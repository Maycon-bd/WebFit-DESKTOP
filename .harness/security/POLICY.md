# Política de segurança do harness

## Princípios
- Dados de saúde, CPF, credenciais, chaves, documentos clínicos e backups são sensíveis.
- Usar somente dados fictícios em desenvolvimento e evidências.
- Não registrar conteúdo clínico ou secrets em logs, prompts, issues ou relatórios.
- Toda operação de domínio deve ser autorizada no backend quando a aplicação existir.
- Mantis é gate especializado; não é substituído por revisão superficial.

## Security Review obrigatório
Acionar o gate para autenticação, autorização, sessão, tokens, permissões, dados sensíveis, multitenancy, upload, arquivos, integrações externas, SQL, pagamentos, dados financeiros, infraestrutura, execução de código, serialização ou criptografia.

## Mantis
Enquanto não houver código executável, não executar Mantis e não gerar findings fictícios. Quando houver código, executar somente em container/sandbox isolado, sem credenciais de produção, rede interna ou dados sensíveis. Findings gerados por IA precisam de validação humana; reproducer não deve rodar diretamente no host.

## Strix
OPTIONAL / FUTURE: considerar apenas para pentest dinâmico de aplicação/API executável em ambiente isolado. Não instalar por redundância nesta fase.