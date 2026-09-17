# Quickstart de validação: Primeiro incremento de Saúde

**Status**: roteiro preparado; não executável ainda porque o repositório não possui aplicação ou dependências.

## Pré-condições

- Windows 10 x64, tela de 1366×768, CPU de quatro núcleos, 8 GB RAM e SSD, ou ambiente real documentado.
- Instalação de teste isolada e sem dados reais.
- Rede indisponível durante os cenários offline.
- Dados fictícios, incluindo base de 2.400 pacientes para medição.
- Resultado do spike G4 e aprovação para criar schema/dependências.

## Sequência do spike

1. Empacotar e instalar em ambiente limpo.
2. Iniciar sem internet e confirmar acesso ao shell.
3. Criar banco vazio, executar migração, gravar registro de teste, fechar e reabrir.
4. Tentar operação sem sessão e com papel/escopo inválido; confirmar negação na fronteira.
5. Simular falha de permissão e falta de espaço em arquivo e backup.
6. Criar snapshot, manifesto e checksums; corromper cópia e confirmar rejeição.
7. Restaurar pacote válido em instalação de teste, preservando o estado atual até confirmação.
8. Medir abertura, pesquisa e salvamento conforme RNF-DES-*.
9. Inspecionar logs e evidências para confirmar ausência de dados proibidos.

## Sequência do primeiro incremento

1. Preparar usuários locais e validar TA-AUT-001..004.
2. Manter perfil e entrar em Saúde; validar TA-CLI-001..002.
3. Executar TA-PAT-001..007 e TA-DRF-001..004 com pacientes fictícios.
4. Executar TA-PRE-001..016 com os exemplos clínicos aprovados.
5. Executar TA-AUD-001..015, incluindo os comportamentos aceitos de D-AUTO-001/002.
6. Executar TA-BKP-001..005.
7. Repetir persistência, offline, acessibilidade, segurança, desempenho e restauração após reinício.

## Critério de passagem

Cada TA aplicável deve apontar para requisito, teste, versão/commit e evidência. Falhas devem permanecer visíveis; nenhum resultado ausente pode ser tratado como aprovado. Antes da implementação, o resultado esperado desta fase é somente a aprovação do design e do spike, não a entrega do produto.