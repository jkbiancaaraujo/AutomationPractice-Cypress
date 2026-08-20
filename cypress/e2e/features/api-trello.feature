# language: pt
@api
Funcionalidade: Consulta de acao da API do Trello
  Como um consumidor da API do Trello
  Eu quero consultar os detalhes de uma acao especifica
  Para validar que o servico responde corretamente e retorna a lista associada

  @funcional @smoke
  Cenario: Consultar uma acao existente retorna o nome da lista associada
    Quando eu envio um GET para a acao "592f11060f95a3d3d46a987a" da API do Trello
    Entao o status code da resposta deve ser 200
    E o nome da lista da resposta deve ser exibido
    E a resposta deve respeitar o contrato esperado de uma acao do Trello

  @excecao
  Cenario: Consultar uma acao com um id em formato invalido retorna erro
    Quando eu envio um GET para a acao "id-invalido-inexistente" da API do Trello
    Entao o status code da resposta deve ser 400
