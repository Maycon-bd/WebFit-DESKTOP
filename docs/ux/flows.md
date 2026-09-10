# Fluxos de interação

**Status:** fluxos do primeiro incremento aprovados.

## Login e espaço

```text
informar credenciais → validar no backend
├── válido → criar sessão → selecionar/entrar em Saúde
└── inválido → informar erro genérico → aplicar espera progressiva
```

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
- A consulta usa conjunto estável entre páginas para não duplicar ou perder eventos.
- Entidade resolvida mostra rótulo atual somente sob autorização; entidade indisponível mostra tipo + ID.
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
