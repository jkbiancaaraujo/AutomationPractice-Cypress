class ProdutosPage {
  path = '/products';

  visitar() {
    cy.visit(this.path);
  }

  pesquisar(termo) {
    cy.get('#search_product').clear().type(termo);
    cy.get('#submit_search').click();
  }

  limparCampoBusca() {
    cy.get('#search_product').clear();
  }

  clicarBotaoBuscar() {
    cy.get('#submit_search').click();
  }

  produtosListados() {
    return cy.get('.productinfo');
  }

  nomesDosProdutos() {
    return cy.get('.productinfo p');
  }

  fecharModalCarrinhoSeAberto() {
    cy.get('body').then(($body) => {
      if ($body.find('#cartModal.in, #cartModal.show').length > 0) {
        cy.get('#cartModal').within(() => {
          cy.contains('Continue Shopping').click();
        });
      }
    });
  }

  adicionarAoCarrinho(nomeProduto) {
    this.fecharModalCarrinhoSeAberto();

    cy.contains('.product-image-wrapper', nomeProduto)
      .find('.add-to-cart')
      .first()
      .click({ force: true });

    cy.get('#cartModal').should('be.visible');
  }

  fecharModalContinuarComprando() {
    cy.get('#cartModal').within(() => {
      cy.contains('Continue Shopping').click();
    });
  }
}

export default new ProdutosPage();
