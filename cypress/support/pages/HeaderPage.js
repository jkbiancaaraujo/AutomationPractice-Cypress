class HeaderPage {
  estaLogado() {
    return cy.contains('Logged in as');
  }
}

export default new HeaderPage();
