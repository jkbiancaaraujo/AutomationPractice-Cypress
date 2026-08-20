# AutomationExercise - Testes Automatizados (Cypress + BDD)

Projeto de testes end-to-end em **BDD (Gherkin)** para o site publico de pratica
[automationexercise.com](https://www.automationexercise.com/), usando **Cypress** +
**Cucumber** (`@badeball/cypress-cucumber-preprocessor`), em JavaScript.

## Status atual

- ✅ Cenarios BDD escritos (`cypress/e2e/features/*.feature`)
- ✅ Automacao completa (`cypress/e2e/step_definitions/`) usando Page Object Model
  (`cypress/support/pages/`)
- ✅ 22/22 cenarios passando (suite completa, UI + API), com relatorio HTML e execucao em CI

O raciocinio de planejamento por tras dos cenarios (escopo, estrategia de risco,
rationale de BDD/POM/dados dinamicos) esta detalhado no [`TEST_PLAN.md`](./TEST_PLAN.md).

## Stack

- [Cypress](https://www.cypress.io/)
- [@badeball/cypress-cucumber-preprocessor](https://github.com/badeball/cypress-cucumber-preprocessor) (BDD/Gherkin)
- [@faker-js/faker](https://fakerjs.dev/) (massa de dados dinamica)
- [cypress-mochawesome-reporter](https://github.com/LironEr/cypress-mochawesome-reporter) (relatorio HTML dos testes)
- Node.js + JavaScript

## Estrutura do projeto

```
automationexercise-cypress/
├── cypress/
│   ├── e2e/
│   │   ├── features/              # Cenarios em Gherkin (.feature)
│   │   │   ├── login.feature
│   │   │   ├── cadastro-usuario.feature
│   │   │   ├── busca-produtos.feature
│   │   │   ├── carrinho-checkout.feature
│   │   │   └── api-trello.feature
│   │   └── step_definitions/      # Orquestracao dos steps (chamam os Page Objects/clients)
│   │       ├── login.js
│   │       ├── cadastro-usuario.js
│   │       ├── busca-produtos.js
│   │       ├── carrinho-checkout.js
│   │       ├── api-trello.js
│   │       └── common.js
│   ├── support/
│   │   ├── pages/                 # Page Objects: seletores + acoes de cada tela (UI)
│   │   ├── api/                   # Clients de API (ex.: TrelloApi)
│   │   ├── factories/             # Geracao de massa de dados dinamica (UsuarioFactory)
│   │   └── e2e.js                 # Bootstrap global (registro do reporter)
│   └── reports/                   # Relatorio HTML gerado a cada execucao (git-ignored)
├── .github/workflows/cypress.yml  # Pipeline de CI (smoke / regressivo)
├── cypress.config.js
├── package.json
├── TEST_PLAN.md                   # Racional de planejamento dos testes
├── .env.example                   # Modelo de variaveis de ambiente
└── .gitignore
```

### Arquitetura da automacao (Page Object Model)

Cada cenario Gherkin (`features/*.feature`) e implementado em um step definition que
apenas orquestra chamadas a um **Page Object** (`support/pages/*.js`) — a classe que
concentra os seletores e acoes de uma tela especifica:

`feature (o que testar)` → `step definition (orquestracao)` → `page object (como interagir com a tela)`

Isso mantem os cenarios de negocio desacoplados de detalhes de implementacao: se um
seletor mudar no site, o ajuste fica isolado no Page Object correspondente.

O mesmo principio se aplica a testes de API: o cenario `api-trello.feature` usa um
**client de API** (`support/api/TrelloApi.js`) no lugar de um Page Object, encapsulando
a chamada `cy.request` e mantendo o step definition livre de detalhes de URL/endpoint.

## Pre-requisitos

- Node.js 18+
- npm

## Instalacao

```bash
npm install
```

## Configuracao de variaveis de ambiente

**Nenhuma credencial fica hardcoded no codigo.** Os testes leem credenciais e
configuracoes a partir de variaveis de ambiente com prefixo `CYPRESS_`, carregadas
automaticamente pelo Cypress (e via `dotenv` no `cypress.config.js`).

1. Copie o arquivo de exemplo:

   ```bash
   cp .env.example .env
   ```

2. Preencha o `.env` com um usuario de teste ja existente no site (necessario para
   os cenarios de login/checkout autenticado):

   ```
   CYPRESS_BASE_URL=https://www.automationexercise.com
   CYPRESS_USER_EMAIL=seu-usuario-de-teste@exemplo.com
   CYPRESS_USER_PASSWORD=sua-senha-de-teste
   CYPRESS_USER_NAME=Nome do usuario de teste
   ```

   > O arquivo `.env` esta no `.gitignore` e nunca deve ser commitado.

Os cenarios de **cadastro de usuario** nao precisam de credenciais fixas: nome,
e-mail e senha sao gerados dinamicamente em tempo de execucao (`@faker-js/faker`)
para evitar dados sensiveis no repositorio e colisao de e-mails ja cadastrados.

## Como rodar

```bash
# Modo interativo (Cypress Test Runner)
npm run cypress:open

# Modo headless (CI/terminal)
npm run cypress:run

# Suite smoke (cenarios tagueados com @smoke, um por feature)
npm run test:smoke

# Suite regressiva completa (todos os cenarios)
npm run test:regression
```

## Suites: smoke x regressivo

Os cenarios "principais" de cada feature (o fluxo feliz mais representativo) estao
marcados com a tag `@smoke` em `cypress/e2e/features/*.feature`, alem das tags
`@funcional`/`@excecao` ja existentes.

- **Smoke**: roda so os cenarios `@smoke` (um por suite), para uma validacao rapida
  do fluxo principal. Local: `npm run test:smoke`. Equivale a
  `cypress run --env tags=@smoke`.
- **Regressivo**: roda a suite completa (todos os cenarios, incluindo os de excecao).
  Local: `npm run test:regression` (ou `npm run cypress:run`).

A filtragem de tags e feita pelo `@badeball/cypress-cucumber-preprocessor`
(`filterSpecs`/`omitFiltered` configurados no `package.json`), que descarta antes da
execucao qualquer spec sem cenarios correspondentes a tag pedida.

No **GitHub Actions**, o mesmo workflow ([`.github/workflows/cypress.yml`](./.github/workflows/cypress.yml))
cobre os dois fluxos:

- Em `push`/`pull_request` para `main`, roda automaticamente a suite **smoke**
  (feedback rapido).
- Via **Actions → Cypress Tests → Run workflow** (`workflow_dispatch`), e possivel
  escolher manualmente `smoke` ou `regression` no campo "Suite a executar".

## Relatorio de testes

Apos qualquer execucao (`cypress:run` ou `cypress:open`), um relatorio HTML e gerado
automaticamente via `cypress-mochawesome-reporter` em:

```
cypress/reports/index.html
```

Basta abrir esse arquivo no navegador para ver o resumo da execucao, cenarios/steps
Gherkin, tempos de duracao e screenshots anexados automaticamente aos testes que
falharem. A pasta `cypress/reports/` e recriada a cada execucao e nao e versionada
(esta no `.gitignore`).

> Como o projeto usa Cucumber, o `cypress-on-fix` tambem esta configurado no
> `cypress.config.js` para evitar conflito entre os hooks `before:run`/`after:run`
> do preprocessor e do reporter.

## CI (GitHub Actions)

O workflow [`.github/workflows/cypress.yml`](./.github/workflows/cypress.yml) roda os
testes em headless (Chrome): a suite **smoke** automaticamente em cada push/PR na
branch `main`, ou a suite `smoke`/`regression` escolhida manualmente via
`workflow_dispatch` (aba Actions).

Antes de habilitar, cadastre os seguintes **Repository Secrets** em
`Settings > Secrets and variables > Actions > New repository secret`:

| Secret                  | Valor                                                     |
| ----------------------- | ---------------------------------------------------------- |
| `CYPRESS_BASE_URL`      | `https://www.automationexercise.com`                       |
| `CYPRESS_USER_EMAIL`    | e-mail do usuario de teste ja cadastrado no site            |
| `CYPRESS_USER_PASSWORD` | senha do usuario de teste                                   |
| `CYPRESS_USER_NAME`     | nome do usuario de teste                                    |

O job:

1. Faz checkout do codigo e instala o Node.js 20.
2. Decide qual script rodar (`test:smoke` ou `test:regression`, conforme o gatilho
   ou a escolha no `workflow_dispatch`) e executa via `cypress-io/github-action`.
3. Publica o relatorio HTML (`cypress/reports`) e, em caso de falha, os
   screenshots (`cypress/screenshots`) como **artifacts** do workflow — disponiveis
   para download na aba "Actions" do GitHub apos a execucao.


## Cenarios cobertos

22 cenarios no total, cobrindo caminho feliz (`@funcional`) e casos de excecao/borda
(`@excecao`) dos 4 fluxos criticos do site, mais 1 cenario de teste de API. O racional
de cada decisao de escopo esta no [`TEST_PLAN.md`](./TEST_PLAN.md#1-escopo-e-estrategia).

### Login (`login.feature`)

| # | Cenario | Tipo |
|---|---|---|
| 1.1 | Login com credenciais validas | Funcional / **Smoke** |
| 1.2 | Login com senha incorreta | Excecao |
| 1.3 | Login com e-mail nao cadastrado | Excecao |
| 1.4 | Login com campos obrigatorios em branco | Excecao |
| 1.5 | Logout de um usuario autenticado | Funcional |

### Cadastro de usuario (`cadastro-usuario.feature`)

| # | Cenario | Tipo |
|---|---|---|
| 2.1 | Cadastro de novo usuario com dados validos e dinamicos | Funcional / **Smoke** |
| 2.2 | Cadastro com e-mail ja existente | Excecao |
| 2.3 | Cadastro com campos obrigatorios (nome/e-mail) em branco | Excecao |
| 2.4 | Finalizar cadastro sem preencher a senha obrigatoria | Excecao |

### Busca de produtos (`busca-produtos.feature`)

| # | Cenario | Tipo |
|---|---|---|
| 3.1 | Busca por termo existente retorna apenas produtos relevantes | Funcional / **Smoke** |
| 3.2 | Busca e case-insensitive | Funcional |
| 3.3 | Busca por termo sem correspondencia | Excecao |
| 3.4 | Busca sem informar nenhum termo | Excecao |

### Carrinho e checkout (`carrinho-checkout.feature`)

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

### API - Trello (`api-trello.feature`)

| # | Cenario | Tipo |
|---|---|---|
| 5.1 | Consultar uma acao existente retorna o nome da lista associada | Funcional / **Smoke** |

Cenario de teste de API (sem UI): envia um `GET` para
`https://api.trello.com/1/actions/{id}`, valida o status code `200` da resposta e
exibe (via `cy.log`) o conteudo do campo `name` dentro da estrutura `data.list` do
corpo retornado.

## Boas praticas seguidas neste projeto

- Sem credenciais ou dados sensiveis versionados (uso de `.env` + `.gitignore`).
- Massa de dados dinamica via `@faker-js/faker` (sem usuarios/e-mails fixos).
- Cenarios BDD escritos antes da automacao, validados via plano de testes.
- Page Object Model: seletores e acoes isolados dos step definitions, evitando
  duplicacao de codigo entre cenarios.
