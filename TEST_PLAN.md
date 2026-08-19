# Plano de Testes - AutomationExercise (Cypress + BDD)

> **Status: aprovado e automatizado.** Os step definitions em `cypress/e2e/step_definitions/`
> implementam todos os cenarios listados abaixo.

Site sob teste: https://www.automationexercise.com/

Mapeamento simples dos cenarios BDD ja escritos em `cypress/e2e/features/` e que
estao propostos para automacao.

## 1. Login (`login.feature`)

| # | Cenario | Tipo |
|---|---|---|
| 1.1 | Login com credenciais validas | Funcional |
| 1.2 | Login com senha incorreta | Excecao |
| 1.3 | Login com e-mail nao cadastrado | Excecao |
| 1.4 | Login com campos obrigatorios em branco | Excecao |
| 1.5 | Logout de um usuario autenticado | Funcional |

## 2. Cadastro de usuario (`cadastro-usuario.feature`)

| # | Cenario | Tipo |
|---|---|---|
| 2.1 | Cadastro de novo usuario com dados validos e dinamicos | Funcional |
| 2.2 | Cadastro com e-mail ja existente | Excecao |
| 2.3 | Cadastro com campos obrigatorios (nome/e-mail) em branco | Excecao |
| 2.4 | Finalizar cadastro sem preencher a senha obrigatoria | Excecao |

## 3. Busca de produtos (`busca-produtos.feature`)

| # | Cenario | Tipo |
|---|---|---|
| 3.1 | Busca por termo existente retorna apenas produtos relevantes | Funcional |
| 3.2 | Busca e case-insensitive | Funcional |
| 3.3 | Busca por termo sem correspondencia | Excecao |
| 3.4 | Busca sem informar nenhum termo | Excecao |

## 4. Carrinho e checkout (`carrinho-checkout.feature`)

| # | Cenario | Tipo |
|---|---|---|
| 4.1 | Adicionar um produto ao carrinho pela listagem | Funcional |
| 4.2 | Validar produto e quantidade no carrinho apos inclusao | Funcional |
| 4.3 | Adicionar multiplos produtos e validar todos no carrinho | Funcional |
| 4.4 | Tentar finalizar checkout sem estar autenticado | Excecao |
| 4.5 | Validar produtos do carrinho na tela de checkout autenticado | Funcional |
| 4.6 | Remover um produto do carrinho | Funcional |
| 4.7 | Remover o unico produto do carrinho exibe mensagem de carrinho vazio | Excecao |
| 4.8 | Nao e possivel prosseguir para o checkout com o carrinho vazio | Excecao |

## Massa de dados

Todos os cenarios que dependem de nome/e-mail/senha de cadastro usarao dados
**gerados dinamicamente em tempo de execucao** via `@faker-js/faker` (nunca valores
fixos hardcoded), evitando colisao de e-mail ja cadastrado entre execucoes.
O unico dado fixo necessario e o de um usuario de teste ja existente para os
cenarios de login/checkout autenticado, fornecido via variaveis de ambiente
(`CYPRESS_USER_EMAIL` / `CYPRESS_USER_PASSWORD`), nunca commitado no repositorio.

## Proximos passos

Apos a aprovacao deste plano:
1. Criar comandos customizados reutilizaveis em `cypress/support/commands.js`
   (ex.: `cy.login()`, `cy.gerarUsuarioDinamico()`, `cy.adicionarProdutoAoCarrinho()`).
2. Implementar os step definitions de cada `.feature` em `cypress/e2e/step_definitions/`.
3. Rodar a suite localmente (`npm run cypress:open` / `npm run cypress:run`).
