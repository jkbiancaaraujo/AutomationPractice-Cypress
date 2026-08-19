# AutomationExercise - Testes Automatizados (Cypress + BDD)

Projeto de testes end-to-end em **BDD (Gherkin)** para o site publico de pratica
[automationexercise.com](https://www.automationexercise.com/), usando **Cypress** +
**Cucumber** (`@badeball/cypress-cucumber-preprocessor`), em JavaScript.

## Status atual

- ✅ Cenarios BDD escritos (`cypress/e2e/features/*.feature`)
- ✅ Plano de testes mapeando os cenarios (`TEST_PLAN.md`)
- ⏳ **Automacao (step definitions) aguardando aprovacao do plano de testes**

Nenhum step definition foi implementado ainda. Revise o [`TEST_PLAN.md`](./TEST_PLAN.md)
antes de prosseguir com a automacao.

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
│   │   │   └── carrinho-checkout.feature
│   │   └── step_definitions/      # Implementacao dos steps (a criar apos aprovacao)
│   └── support/
│       └── e2e.js                 # Suporte global / comandos customizados
├── cypress.config.js
├── package.json
├── TEST_PLAN.md                   # Plano de testes (mapeamento de cenarios)
├── .env.example                   # Modelo de variaveis de ambiente
└── .gitignore
```

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
```

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

O workflow [`.github/workflows/cypress.yml`](./.github/workflows/cypress.yml) roda a suite
completa em headless (Chrome) a cada push/PR na branch `main` (e manualmente via
`workflow_dispatch`).

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
2. Instala dependencias e roda `cypress run` via `cypress-io/github-action`.
3. Publica o relatorio HTML (`cypress/reports`) e, em caso de falha, os
   screenshots (`cypress/screenshots`) como **artifacts** do workflow — disponiveis
   para download na aba "Actions" do GitHub apos a execucao.

## Cenarios cobertos

Veja o detalhamento completo em [`TEST_PLAN.md`](./TEST_PLAN.md). Resumo:

- **Login**: credenciais validas, senha incorreta, e-mail nao cadastrado, campos
  obrigatorios em branco, logout.
- **Cadastro de usuario**: cadastro com dados dinamicos, e-mail ja existente,
  campos obrigatorios em branco, senha obrigatoria ausente.
- **Busca de produtos**: termo existente e relevante, case-insensitive, termo sem
  correspondencia, busca sem termo.
- **Carrinho e checkout**: adicionar produto, validar produto/quantidade/total no
  carrinho, multiplos produtos, checkout sem login, validacao dos produtos na tela
  de checkout autenticado, remover produto do carrinho, carrinho vazio apos remocao
  e bloqueio do checkout com carrinho vazio.

## Boas praticas seguidas neste projeto

- Sem credenciais ou dados sensiveis versionados (uso de `.env` + `.gitignore`).
- Massa de dados dinamica via `@faker-js/faker` (sem usuarios/e-mails fixos).
- Cenarios BDD escritos antes da automacao, validados via plano de testes.
- Reuso de comandos customizados planejado para evitar duplicacao de codigo entre
  step definitions (ver secao "Proximos passos" do `TEST_PLAN.md`).
