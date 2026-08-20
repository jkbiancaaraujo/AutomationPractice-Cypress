# language: pt
@login
Funcionalidade: Login de usuario
  Como um usuario do site AutomationExercise
  Eu quero poder entrar na minha conta
  Para acessar funcionalidades exclusivas de usuarios autenticados

  Contexto:
    Dado que estou na pagina de login do AutomationExercise

  @funcional @smoke
  Cenario: Login com credenciais validas
    Dado que possuo uma conta previamente cadastrada e valida
    Quando eu informo o e-mail e a senha corretos
    E eu clico no botao "Login"
    Entao eu devo ser autenticado com sucesso
    E o cabecalho do site deve exibir "Logged in as" seguido do meu nome de usuario

  @excecao
  Cenario: Login com senha incorreta
    Quando eu informo um e-mail cadastrado e uma senha incorreta
    E eu clico no botao "Login"
    Entao eu devo permanecer na pagina de login
    E a mensagem "Your email or password is incorrect!" deve ser exibida

  @excecao
  Cenario: Login com e-mail nao cadastrado
    Quando eu informo um e-mail que nao existe na base de usuarios e uma senha qualquer
    E eu clico no botao "Login"
    Entao eu devo permanecer na pagina de login
    E a mensagem "Your email or password is incorrect!" deve ser exibida

  @excecao
  Cenario: Login com campos obrigatorios em branco
    Quando eu clico no botao "Login" sem preencher e-mail e senha
    Entao o formulario nao deve ser submetido
    E eu devo permanecer na pagina de login

  @funcional
  Cenario: Logout de um usuario autenticado
    Dado que estou autenticado com uma conta valida
    Quando eu clico na opcao "Logout" do menu
    Entao eu devo ser redirecionado para a pagina de login
    E o cabecalho do site deve voltar a exibir a opcao "Signup / Login"
