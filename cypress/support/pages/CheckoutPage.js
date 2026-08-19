class CheckoutPage {
  path = '/checkout';

  deveEstarNestaPagina() {
    cy.location('pathname').should('eq', this.path);
  }
}

export default new CheckoutPage();
