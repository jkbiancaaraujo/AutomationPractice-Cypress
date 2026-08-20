# language: pt
@carrinho
Funcionalidade: Carrinho de compras e validacao no checkout
  Como um usuario do site AutomationExercise
  Eu quero adicionar produtos ao carrinho e valida-los antes de pagar
  Para garantir que estou comprando exatamente o que escolhi

  Contexto:
    Dado que estou na pagina de produtos do AutomationExercise

  @funcional
  Cenario: Adicionar um produto ao carrinho pela listagem de produtos
    Quando eu adiciono o produto "Blue Top" ao carrinho a partir da listagem
    Entao a confirmacao "Added!" deve ser exibida
    E a mensagem "Your product has been added to cart." deve ser exibida

  @funcional
  Cenario: Validar produto e quantidade no carrinho apos a inclusao
    Quando eu adiciono o produto "Blue Top" ao carrinho a partir da listagem
    E eu acesso a pagina do carrinho
    Entao o produto "Blue Top" deve estar listado na tabela do carrinho
    E a quantidade do produto deve ser igual a 1
    E o preco total do item deve ser igual ao preco unitario multiplicado pela quantidade

  @funcional
  Cenario: Adicionar multiplos produtos e validar todos no carrinho
    Quando eu adiciono o produto "Blue Top" ao carrinho a partir da listagem
    E eu adiciono o produto "Men Tshirt" ao carrinho a partir da listagem
    E eu acesso a pagina do carrinho
    Entao ambos os produtos "Blue Top" e "Men Tshirt" devem estar listados na tabela do carrinho
    E o total geral do carrinho deve corresponder a soma dos totais de cada item

  @excecao
  Cenario: Tentar finalizar a compra (checkout) sem estar autenticado
    Quando eu adiciono o produto "Blue Top" ao carrinho a partir da listagem
    E eu acesso a pagina do carrinho
    E eu clico no botao "Proceed To Checkout"
    Entao a mensagem "Register / Login account to proceed on checkout." deve ser exibida
    E um link para a pagina de login deve ser oferecido

  @funcional @smoke
  Cenario: Validar os produtos do carrinho na tela de checkout estando autenticado
    Dado que estou autenticado com uma conta valida
    Quando eu adiciono o produto "Blue Top" ao carrinho a partir da listagem
    E eu acesso a pagina do carrinho
    E eu clico no botao "Proceed To Checkout"
    Entao eu devo ser direcionado para a pagina de checkout
    E o produto "Blue Top" deve estar listado com a mesma quantidade e preco exibidos no carrinho
    E o endereco de entrega e cobranca da minha conta deve ser exibido para conferencia

  @funcional
  Cenario: Remover um produto do carrinho
    Quando eu adiciono o produto "Blue Top" ao carrinho a partir da listagem
    E eu acesso a pagina do carrinho
    E eu clico no icone de remocao ("X") daquele item
    Entao o produto "Blue Top" nao deve mais aparecer na tabela do carrinho
    E o total do carrinho deve ser recalculado excluindo aquele item

  @excecao
  Cenario: Remover o unico produto do carrinho exibe a mensagem de carrinho vazio
    Dado que existe exatamente um produto no carrinho
    Quando eu clico no icone de remocao ("X") daquele item
    Entao a mensagem "Cart is empty! Click here to buy products." deve ser exibida
    E um link "here" para a pagina de produtos deve ser oferecido

  @excecao
  Cenario: Nao e possivel prosseguir para o checkout com o carrinho vazio
    Dado que meu carrinho de compras esta vazio
    Quando eu acesso a pagina do carrinho
    Entao o botao "Proceed To Checkout" nao deve ser exibido
    E a mensagem "Cart is empty! Click here to buy products." deve ser exibida
