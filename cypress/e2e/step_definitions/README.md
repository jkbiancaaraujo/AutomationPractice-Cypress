# Step Definitions

Implementacao dos steps (Given/When/Then) dos cenarios em `cypress/e2e/features/*.feature`.

- `common.js`: steps compartilhados por mais de um `.feature` (navegacao, login via env, mensagens genericas).
- `login.js`, `cadastro-usuario.js`, `busca-produtos.js`, `carrinho-checkout.js`: steps especificos de cada funcionalidade de UI.
- `api-trello.js`: steps do cenario de teste de API (`api-trello.feature`), sem UI.

Toda logica de interacao com a UI (seletores e acoes de cada tela) fica centralizada nos
Page Objects em `cypress/support/pages` (`LoginPage`, `CadastroPage`, `ProdutosPage`,
`CarrinhoPage`, `CheckoutPage`, `HeaderPage`). Os step definitions apenas orquestram
chamadas aos Page Objects e fazem as asserções do cenário — nenhum seletor de UI deve
ficar hardcoded diretamente em um arquivo de step. Dados variaveis (nomes, e-mails,
enderecos) sao gerados dinamicamente via a `UsuarioFactory` em `cypress/support/factories`,
que encapsula o uso do `@faker-js/faker`, evitando duplicacao e dados fixos/sensiveis.

Para o cenario de API, o mesmo principio se aplica com um **client de API**
(`TrelloApi` em `cypress/support/api`): o step definition apenas chama o client e
faz as asserções, sem montar URL ou detalhes da requisicao diretamente no step.
