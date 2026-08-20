import { limparEDigitar } from './utils';

class LoginPage {
  path = '/login';

  visitar() {
    cy.visit(this.path);
  }

  preencherCredenciais(email, senha) {
    limparEDigitar('input[data-qa="login-email"]', email);
    limparEDigitar('input[data-qa="login-password"]', senha, { log: false });
  }

  clicarBotaoLogin() {
    cy.get('button[data-qa="login-button"]').click({ force: true });
  }

  deveEstarNestaPagina() {
    cy.contains('h2', 'Login to your account').should('be.visible');
  }

  loginComEnv() {
    this.visitar();
    this.preencherCredenciais(Cypress.env('userEmail'), Cypress.env('userPassword'));
    this.clicarBotaoLogin();
  }
}

export default new LoginPage();
