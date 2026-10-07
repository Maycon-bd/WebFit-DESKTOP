# Fluxos de interação

**Status:** fluxos do primeiro incremento aprovados.

## Login e espaço

```text
informar credenciais → validar no backend
├── válido → criar sessão → selecionar/entrar em Saúde
└── inválido → informar erro genérico → aplicar espera progressiva
```

## Navegação do Consultório — RF-UX-003 / DEC-055

- Hambúrguer → ocultar/reabrir toda a lateral; somente o ícone de menu permanece da navegação recolhida. A tela, seus campos, sessão, tutorial e atualização permanecem.
- Consultório → Pacientes. Apenas este módulo é exibido no incremento.
- Engrenagem junto ao nome → Configurações → Auditoria ou Backup e restauração → Voltar às Configurações. O índice não consulta ferramentas antes da seleção.
- Nome do usuário → opções Acesso / Perfil profissional. Escape fecha e devolve foco ao nome. Selecionar destino salva o rascunho antes de navegar; falha mantém tela, dados e erro. Navegação bem-sucedida leva foco ao título, preservando foco de tutorial ativo.
- Troca obrigatória de senha mantém destinos bloqueados. Logout e autorização backend continuam vigentes.
- A lateral inicia aberta em cada sessão; recolhimento não persiste. Tours mantêm IDs existentes e usam alvo visível no hambúrguer quando Logout está oculto.

## Cadastro de paciente

```text
Pacientes → Novo → preencher formulário → Salvar
                  ↘ autosave de rascunho a cada ~30 s
```

- Erro de validação mantém dados e leva ao campo correspondente.
- CPF inválido ou duplicado impede conclusão.
- Ao retornar, oferecer continuar ou descartar rascunho autenticado.
- Salvar cria o paciente, remove o rascunho e registra auditoria.

## Pesquisa e manutenção

```text
lista ativa → pesquisar → abrir paciente → editar
├── Salvar → persistir e auditar
└── Cancelar → descartar alterações não confirmadas
```

## Arquivamento

```text
paciente ativo → confirmar arquivamento → paciente arquivado
paciente arquivado → tentar novo registro → exigir restauração
paciente arquivado → restaurar → mesmo prontuário ativo
```

## Consulta de auditoria

Auditoria → últimos 30 dias → página 1 de até 50 registros
→ ordenar do mais recente para o mais antigo
→ filtrar por período + usuário + ação + entidade + resultado (AND)
→ abrir detalhe de metadados permitidos

- Abertura do módulo e detalhe são auditadas uma única vez; filtros, páginas e ordenação não geram eventos.
- Conforme D-AUTO-002, a consulta usa janela UTC semiaberta congelada, desempate por ID e cursor opaco para não duplicar ou perder eventos entre páginas.
- Entidade resolvida mostra rótulo atual somente sob autorização; entidade indisponível mostra tipo + ID.
- Conforme D-AUTO-001, atores automáticos e pré-autenticação aparecem como Sistema e Não autenticado, sem credencial ou identificador tentado.
- Sem eventos e nenhum resultado são estados vazios distintos.
- Falha mostra erro seguro e nova tentativa quando recuperável; nunca aparece como lista vazia.
- Não existem edição, exclusão ou exportação no incremento 1.
## Backup e restauração

```text
backup → snapshot consistente → pacote + manifesto + checksums
→ validar → registrar sucesso → aplicar retenção

restaurar → selecionar pacote → validar em área temporária
├── inválido → rejeitar e preservar estado
└── válido → confirmar → preservar estado atual → substituir → verificar
```
