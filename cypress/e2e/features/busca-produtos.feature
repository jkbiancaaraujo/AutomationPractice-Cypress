# language: pt
@busca
Funcionalidade: Busca de produtos
  Como um usuario do site AutomationExercise
  Eu quero pesquisar produtos pelo nome
  Para encontrar rapidamente o que eu preciso comprar

  Contexto:
    Dado que estou na pagina de produtos do AutomationExercise

  @funcional @smoke
  Cenario: Buscar por um termo existente retorna produtos relacionados
    Quando eu pesquiso pelo termo "Top"
    Entao a secao "Searched Products" deve ser exibida
    E pelo menos um produto retornado deve conter o termo pesquisado no nome

  @funcional
  Cenario: Busca e case-insensitive
    Quando eu pesquiso pelo termo "TOP" em letras maiusculas
    E eu pesquiso pelo termo "top" em letras minusculas
    Entao os dois resultados devem conter exatamente os mesmos produtos

  @excecao
  Cenario: Buscar por um termo sem nenhum produto correspondente
    Quando eu pesquiso por um termo aleatorio que nao corresponde a nenhum produto do catalogo
    Entao a secao "Searched Products" deve ser exibida
    E nenhum produto deve ser listado no resultado

  @excecao
  Cenario: Buscar sem informar nenhum termo
    Quando eu clico no botao de busca sem preencher o campo de pesquisa
    Entao a pagina deve exibir a listagem "All Products"
    E nenhum erro deve ser apresentado ao usuario
