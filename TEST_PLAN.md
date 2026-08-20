# Plano de Testes - AutomationExercise (Cypress + BDD)

> **Status: plano aprovado e 100% automatizado.** Todos os cenarios descritos abaixo
> estao implementados em `cypress/e2e/features/` (Gherkin) e
> `cypress/e2e/step_definitions/` (automacao), passando na suite completa.

Site sob teste: https://www.automationexercise.com/ (aplicacao publica real, sem mocks).

Este documento registra o raciocinio de planejamento por tras da suite: o que testar,
por que testar, como organizar a automacao e como isso roda em CI. A ideia e que
qualquer pessoa - inclusive sem acesso ao codigo - consiga entender a cobertura e as
decisoes de projeto so lendo este arquivo.

## 1. Escopo e estrategia

O sistema foi dividido em 4 fluxos de negocio, cada um com sua propria feature file.
Para cada fluxo, os cenarios foram planejados cobrindo:

- **Caminho feliz** (`@funcional`): o fluxo principal funcionando como esperado.
- **Casos de excecao/borda** (`@excecao`): erros de usuario, dados invalidos, estados
  vazios e tentativas de burlar regras de negocio (ex.: checkout sem login).

Dentro de cada suite, o cenario que representa o fluxo mais critico/representativo
tambem recebe a tag `@smoke`, permitindo rodar uma verificacao rapida de "a aplicacao
esta no ar e funcionando" sem esperar a suite inteira (ver secao 4).

**Por que BDD (Gherkin)?** Os cenarios ficam legiveis por qualquer stakeholder (PO,
dev, QA) sem precisar ler codigo, funcionando como documentacao viva do
comportamento esperado do sistema.

**Por que Page Object Model?** Toda a interacao com elementos da tela (seletores,
cliques, preenchimento de formulario) fica isolada em classes dedicadas
(`cypress/support/pages/*.js`), e os step definitions apenas orquestram chamadas a
esses metodos. Isso significa que, se um seletor mudar no site, o ajuste e feito em
um unico lugar, sem tocar nos cenarios de negocio.

**Por que massa de dados dinamica?** Cenarios de cadastro usam nome/e-mail/senha
gerados em tempo de execucao (`@faker-js/faker`), evitando testes frageis por colisao
de e-mail ja cadastrado e eliminando qualquer dado sensivel versionado no repositorio.

**Por que tambem um teste de API?** Alem dos fluxos de UI, a suite inclui um cenario
de teste de API (`api-trello.feature`) contra um servico externo (Trello), cobrindo o
contrato de resposta (status code e estrutura do payload) de forma independente da
interface grafica - uma camada de teste mais rapida e menos fragil que a UI.

## 2. Cobertura de cenarios

### 2.1 Login (`login.feature`)

| # | Cenario | Tipo |
|---|---|---|
| 1.1 | Login com credenciais validas | Funcional / **Smoke** |
| 1.2 | Login com senha incorreta | Excecao |
| 1.3 | Login com e-mail nao cadastrado | Excecao |
| 1.4 | Login com campos obrigatorios em branco | Excecao |
| 1.5 | Logout de um usuario autenticado | Funcional |

### 2.2 Cadastro de usuario (`cadastro-usuario.feature`)

| # | Cenario | Tipo |
|---|---|---|
| 2.1 | Cadastro de novo usuario com dados validos e dinamicos | Funcional / **Smoke** |
| 2.2 | Cadastro com e-mail ja existente | Excecao |
| 2.3 | Cadastro com campos obrigatorios (nome/e-mail) em branco | Excecao |
| 2.4 | Finalizar cadastro sem preencher a senha obrigatoria | Excecao |

### 2.3 Busca de produtos (`busca-produtos.feature`)

| # | Cenario | Tipo |
|---|---|---|
| 3.1 | Busca por termo existente retorna apenas produtos relevantes | Funcional / **Smoke** |
| 3.2 | Busca e case-insensitive | Funcional |
| 3.3 | Busca por termo sem correspondencia | Excecao |
| 3.4 | Busca sem informar nenhum termo | Excecao |

### 2.4 Carrinho e checkout (`carrinho-checkout.feature`)

| # | Cenario | Tipo |
|---|---|---|
| 4.1 | Adicionar um produto ao carrinho pela listagem | Funcional |
| 4.2 | Validar produto e quantidade no carrinho apos inclusao | Funcional |
| 4.3 | Adicionar multiplos produtos e validar todos no carrinho | Funcional |
| 4.4 | Tentar finalizar checkout sem estar autenticado | Excecao |
| 4.5 | Validar produtos do carrinho na tela de checkout autenticado | Funcional / **Smoke** |
| 4.6 | Remover um produto do carrinho | Funcional |
| 4.7 | Remover o unico produto do carrinho exibe mensagem de carrinho vazio | Excecao |
| 4.8 | Nao e possivel prosseguir para o checkout com o carrinho vazio | Excecao |

### 2.5 API - Trello (`api-trello.feature`)

| # | Cenario | Tipo |
|---|---|---|
| 5.1 | Consultar uma acao existente retorna o nome da lista associada | Funcional / **Smoke** |
| 5.2 | Consultar uma acao com um id em formato invalido retorna erro | Excecao |

**Total: 23 cenarios**, cobrindo os 4 fluxos criticos de UI do site (autenticacao,
cadastro, busca e compra) mais 2 testes de API (contrato + excecao), com 5 deles
marcados como smoke (um por suite).

## 3. Arquitetura da automacao

```
cypress/
├── e2e/
│   ├── features/              # Cenarios em Gherkin (a especificacao "o que" testar)
│   └── step_definitions/      # Codigo que conecta cada frase do Gherkin a uma acao
└── support/
    ├── pages/                 # Page Objects: um arquivo por tela (seletores + acoes)
    ├── api/                   # Clients de API (ex.: TrelloApi), equivalente ao POM para API
    ├── factories/              # Geracao de massa de dados dinamica (UsuarioFactory)
    └── e2e.js                 # Bootstrap global (registro do reporter, etc.)
```

Fluxo de responsabilidade: **feature (o que)** → **step definition (orquestracao)** →
**page object / api client (como)** → **Cypress commands / cy.request (interacao real)**.

## 4. Estrategia de execucao: smoke x regressivo

| Suite | Quando usar | Cenarios |
|---|---|---|
| **Smoke** | Feedback rapido a cada push/PR, checagem de "esta tudo no ar" | 5 (um por fluxo, tag `@smoke`) |
| **Regressivo** | Antes de releases, validacao completa de negocio | 23 (suite inteira) |

A filtragem por tag e feita pelo proprio `@badeball/cypress-cucumber-preprocessor`
(`--env tags=@smoke`), sem necessidade de manter arquivos de teste duplicados. Comandos
para rodar cada suite (local e CI) estao no [`README.md`](./README.md#suites-smoke-x-regressivo).

## 5. Massa de dados

- Cadastro/busca/carrinho: dados **gerados dinamicamente** via `@faker-js/faker` a
  cada execucao, sem valores fixos no repositorio.
- Login/checkout autenticado: usam um usuario de teste ja existente no site, cujas
  credenciais vem de variaveis de ambiente (`CYPRESS_USER_EMAIL` /
  `CYPRESS_USER_PASSWORD`), nunca commitadas (`.env` esta no `.gitignore`; ver
  `.env.example` para o formato esperado).

## 6. Execucao, CI e relatorio

Instrucoes de instalacao, variaveis de ambiente, comandos de execucao, pipeline de
CI (GitHub Actions) e relatorio HTML estao centralizados no
[`README.md`](./README.md) para evitar duplicacao - esse plano foca no **racional**
de teste, nao na operacao do projeto.

## 7. Status atual

| Suite | Cenarios | Resultado |
|---|---|---|
| Login | 5 | ✅ 5/5 |
| Cadastro de usuario | 4 | ✅ 4/4 |
| Busca de produtos | 4 | ✅ 4/4 |
| Carrinho e checkout | 8 | ✅ 8/8 |
| API - Trello | 2 | ✅ 2/2 |
| **Total** | **23** | ✅ **23/23** |
