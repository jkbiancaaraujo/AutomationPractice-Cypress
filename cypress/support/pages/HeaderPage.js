class HeaderPage {
  estaLogado() {
    return cy.contains('Logged in as');
  }

  clicarOpcaoDoMenu(texto) {
    cy.contains(texto).click();
  }
}

export default new HeaderPage();
