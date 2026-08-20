import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import 'cypress-mochawesome-reporter/cucumberSupport';
import { LoginPage, ProdutosPage, HeaderPage } from '../../support/pages';

Given('que estou na pagina de login do AutomationExercise', () => {
  LoginPage.visitar();
});

Given('que estou na pagina de produtos do AutomationExercise', () => {
  ProdutosPage.visitar();
});

Given('que estou autenticado com uma conta valida', () => {
  LoginPage.loginComEnv();
  HeaderPage.estaLogado().should('be.visible');
});

const SELETORES_BOTOES_AMBIGUOS = {
  Signup: 'button[data-qa="signup-button"]',
  Login: 'button[data-qa="login-button"]',
};

When('eu clico no botao {string}', (texto) => {
  const seletor = SELETORES_BOTOES_AMBIGUOS[texto];

  if (seletor) {
    cy.get(seletor).click({ force: true });
    return;
  }

  cy.contains(texto).click({ force: true });
});

Then('a mensagem {string} deve ser exibida', (mensagem) => {
  cy.contains(mensagem).should('be.visible');
});

Then('eu devo permanecer na pagina de login', () => {
  LoginPage.deveEstarNestaPagina();
});

Then('o formulario nao deve ser submetido', () => {
  cy.contains('Account Created!').should('not.exist');
  HeaderPage.estaLogado().should('not.exist');
});

Then('o cabecalho do site deve exibir "Logged in as" seguido do meu nome de usuario', () => {
  HeaderPage.estaLogado().should('be.visible');
});
