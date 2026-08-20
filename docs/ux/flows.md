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

## Backup e restauração

```text
backup → snapshot consistente → pacote + manifesto + checksums
→ validar → registrar sucesso → aplicar retenção

restaurar → selecionar pacote → validar em área temporária
├── inválido → rejeitar e preservar estado
└── válido → confirmar → preservar estado atual → substituir → verificar
```
