# language: pt
@cadastro
Funcionalidade: Cadastro de novo usuario
  Como um visitante do site AutomationExercise
  Eu quero criar uma nova conta
  Para acessar a area logada e realizar compras

  Contexto:
    Dado que estou na pagina de login do AutomationExercise

  @funcional
  Cenario: Cadastro de um novo usuario com dados validos e dinamicos
    Quando eu informo um nome e um e-mail unicos gerados dinamicamente no formulario "New User Signup!"
    E eu clico no botao "Signup"
    Entao eu devo ser direcionado para a pagina "Enter Account Information"
    Quando eu preencho as informacoes obrigatorias da conta com dados validos e dinamicos
    E eu clico no botao "Create Account"
    Entao a mensagem "Account Created!" deve ser exibida
    Quando eu clico no botao "Continue"
    Entao eu devo estar autenticado automaticamente
    E o cabecalho do site deve exibir "Logged in as" seguido do meu nome de usuario

  @excecao
  Cenario: Tentativa de cadastro com e-mail ja existente
    Dado que ja existe uma conta cadastrada com um e-mail conhecido
    Quando eu informo um nome qualquer e o e-mail ja cadastrado no formulario "New User Signup!"
    E eu clico no botao "Signup"
    Entao eu devo permanecer na pagina de login
    E a mensagem "Email Address already exist!" deve ser exibida

  @excecao
  Cenario: Tentativa de cadastro com campos obrigatorios em branco
    Quando eu clico no botao "Signup" sem preencher nome e e-mail
    Entao o formulario nao deve ser submetido
    E eu devo permanecer na pagina de login

  @excecao
  Cenario: Tentativa de finalizar cadastro sem preencher a senha obrigatoria
    Quando eu informo um nome e um e-mail unicos gerados dinamicamente no formulario "New User Signup!"
    E eu clico no botao "Signup"
    E eu preencho as informacoes da conta deixando o campo "Password" em branco
    E eu clico no botao "Create Account"
    Entao o formulario nao deve ser submetido
    E eu devo permanecer na pagina "Enter Account Information"
