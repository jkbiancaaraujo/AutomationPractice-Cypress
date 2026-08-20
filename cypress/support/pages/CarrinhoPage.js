class CarrinhoPage {
  path = '/view_cart';

  visitar() {
    cy.visit(this.path);
  }

  linhaDoProduto(nomeProduto) {
    return cy.get('#cart_info tbody').contains('tr', nomeProduto);
  }

  todasAsLinhas() {
    return cy.get('#cart_info tbody tr');
  }

  quantidadeDoProduto(nomeProduto) {
    return this.linhaDoProduto(nomeProduto).find('.cart_quantity button');
  }

  removerProduto(nomeProduto) {
    this.linhaDoProduto(nomeProduto).find('.cart_quantity_delete').click();
  }

  extrairValoresDaLinha($linha) {
    const preco = parseFloat(
      $linha
        .find('.cart_price p')
        .text()
        .replace(/[^\d.]/g, '')
    );
    const quantidade = parseInt($linha.find('.cart_quantity button').text().trim(), 10);
    const total = parseFloat(
      $linha
        .find('.cart_total .cart_total_price')
        .text()
        .replace(/[^\d.]/g, '')
    );
    return { preco, quantidade, total };
  }

  enderecoEntrega() {
    return cy.get('#address_delivery');
  }

  enderecoCobranca() {
    return cy.get('#address_invoice');
  }

  linkParaLogin() {
    return cy.get('a[href="/login"]');
  }
}

export default new CarrinhoPage();
