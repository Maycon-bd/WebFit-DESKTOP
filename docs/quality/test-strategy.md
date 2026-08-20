# Estratégia de testes

**Status:** baseline do primeiro incremento aprovada.

## Níveis

- testes unitários de domínio e validação;
- testes de componentes e fluxos React;
- testes de comandos e autorização Rust;
- integração SQLite com banco real temporário;
- migração de banco vazio e da versão anterior;
- testes de contrato IPC;
- testes de backup/restauração e falhas;
- testes de acessibilidade por ferramenta e revisão manual;
- testes de instalador Windows em ambiente limpo;
- testes de aceite na Sprint Review.

## Dados e segurança

- usar apenas dados fictícios;
- verificar ausência de dados sensíveis em logs;
- testar ambos os papéis e sessão expirada;
- testar CPF inválido/duplicado, transações e foreign keys;
- testar corrupção, disco cheio, falta de permissão e interrupção;
- nunca declarar sucesso simulado.

## Desempenho

Medir início frio, pesquisa, abertura e salvamento na baseline definida em RNFs, com 2.400 pacientes fictícios e registro do percentil 95.

## Evidência

Cada execução registra comando, ambiente, versão, resultado e artefato. Testes de aceite usam IDs `TA-*` e atualizam a matriz de rastreabilidade.
