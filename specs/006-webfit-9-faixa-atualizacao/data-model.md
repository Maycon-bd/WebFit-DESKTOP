# Data Model — WEBFIT-9

Somente memória, sem schema novo.
- Consulta: token efêmero, instante da tentativa, promise pendente/concluída. Intervalo 30 minutos ou cooldown de retorno um minuto. Uma sessão corrente no cache.
- Versão disponível: version/notes retornados pelo backend autorizado.
- Adiamento: versão adiada por sessão; outra versão não é ocultada.
- UI: installing, message, progress e detalhes. Instalação pausa checks. Saída remove subscription e descarta entrega antiga. Offline mantém versão conhecida; erro de instalação mantém recuperação.
