class LoginPage {
  path = '/login';

  visitar() {
    cy.visit(this.path);
  }

  preencherCredenciais(email, senha) {
    cy.get('input[data-qa="login-email"]').clear().type(email);
    cy.get('input[data-qa="login-password"]').clear().type(senha, { log: false });
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
    cy.contains('button[data-qa="login-button"]', 'Login').click();
  }
}

export default new LoginPage();
