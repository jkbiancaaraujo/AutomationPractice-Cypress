class LoginPage {
  path = '/login';

  visitar() {
    cy.visit(this.path);
  }

  preencherCredenciais(email, senha) {
    cy.get('input[data-qa="login-email"]').clear().type(email);
    cy.get('input[data-qa="login-password"]').clear().type(senha, { log: false });
  }

  deveEstarNestaPagina() {
    // Nao usamos cy.location aqui porque, em caso de e-mail ja cadastrado, o site
    // renderiza o conteudo da pagina de login mesmo mantendo a URL em /signup (sem redirecionar).
    cy.contains('h2', 'Login to your account').should('be.visible');
  }

  // Fluxo completo de autenticacao usando as credenciais configuradas via .env.
  loginComEnv() {
    this.visitar();
    this.preencherCredenciais(Cypress.env('userEmail'), Cypress.env('userPassword'));
    cy.contains('button[data-qa="login-button"]', 'Login').click();
  }
}

export default new LoginPage();
