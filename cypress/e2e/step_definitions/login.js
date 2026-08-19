import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { LoginPage, HeaderPage } from '../../support/pages';

Given('que possuo uma conta previamente cadastrada e valida', () => {
  // Reutiliza a conta de teste configurada via variaveis de ambiente (.env).
});

When('eu informo o e-mail e a senha corretos', () => {
  LoginPage.preencherCredenciais(Cypress.env('userEmail'), Cypress.env('userPassword'));
});

When('eu informo um e-mail cadastrado e uma senha incorreta', () => {
  LoginPage.preencherCredenciais(Cypress.env('userEmail'), 'SenhaIncorreta!123');
});

When('eu informo um e-mail que nao existe na base de usuarios e uma senha qualquer', () => {
  const emailInexistente = `usuario.inexistente.${Date.now()}@example.com`;
  LoginPage.preencherCredenciais(emailInexistente, 'QualquerSenha!123');
});

Then('eu devo ser autenticado com sucesso', () => {
  HeaderPage.estaLogado().should('be.visible');
});

When('eu clico no botao {string} sem preencher e-mail e senha', () => {
  // cy.contains('Login') ambiguamente casaria com o link "Signup / Login" do menu.
  cy.get('button[data-qa="login-button"]').click({ force: true });
});

When('eu clico na opcao {string} do menu', (texto) => {
  cy.contains(texto).click();
});

Then('eu devo ser redirecionado para a pagina de login', () => {
  LoginPage.deveEstarNestaPagina();
});

Then('o cabecalho do site deve voltar a exibir a opcao {string}', (texto) => {
  cy.contains(texto).should('be.visible');
});
