import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { ProdutosPage, CarrinhoPage, CheckoutPage } from '../../support/pages';

When('eu adiciono o produto {string} ao carrinho a partir da listagem', function (nomeProduto) {
  ProdutosPage.adicionarAoCarrinho(nomeProduto);
  this.produtoAtual = nomeProduto;
});

Then('a confirmacao {string} deve ser exibida', (texto) => {
  cy.get('#cartModal').should('be.visible').and('contain', texto);
});

When('eu acesso a pagina do carrinho', () => {
  CarrinhoPage.visitar();
});

Then('o produto {string} deve estar listado na tabela do carrinho', (nomeProduto) => {
  CarrinhoPage.linhaDoProduto(nomeProduto).should('be.visible');
});

Then('a quantidade do produto deve ser igual a {int}', function (quantidade) {
  CarrinhoPage.quantidadeDoProduto(this.produtoAtual).should('contain', String(quantidade));
});

Then('o preco total do item deve ser igual ao preco unitario multiplicado pela quantidade', function () {
  CarrinhoPage.linhaDoProduto(this.produtoAtual).then(($linha) => {
    const { preco, quantidade, total } = CarrinhoPage.extrairValoresDaLinha($linha);
    expect(total).to.eq(preco * quantidade);
  });
});

Then('ambos os produtos {string} e {string} devem estar listados na tabela do carrinho', (produto1, produto2) => {
  CarrinhoPage.linhaDoProduto(produto1).should('be.visible');
  CarrinhoPage.linhaDoProduto(produto2).should('be.visible');
});

Then('o total geral do carrinho deve corresponder a soma dos totais de cada item', () => {
  CarrinhoPage.todasAsLinhas().each(($linha) => {
    const { preco, quantidade, total } = CarrinhoPage.extrairValoresDaLinha($linha);
    expect(total).to.eq(preco * quantidade);
  });
});

Then('eu devo ser direcionado para a pagina de checkout', () => {
  CheckoutPage.deveEstarNestaPagina();
});

Then('o produto {string} deve estar listado com a mesma quantidade e preco exibidos no carrinho', (nomeProduto) => {
  CarrinhoPage.linhaDoProduto(nomeProduto).should('be.visible');
});

Then('o endereco de entrega e cobranca da minha conta deve ser exibido para conferencia', () => {
  CarrinhoPage.enderecoEntrega().should('be.visible');
  CarrinhoPage.enderecoCobranca().should('be.visible');
});

Then('um link para a pagina de login deve ser oferecido', () => {
  CarrinhoPage.linkParaLogin().should('exist');
});

When(/^eu clico no icone de remocao \("X"\) daquele item$/, function () {
  CarrinhoPage.removerProduto(this.produtoAtual);
});

Then('o produto {string} nao deve mais aparecer na tabela do carrinho', (nomeProduto) => {
  cy.get('#cart_info tbody').should('not.contain', nomeProduto);
});

Then('o total do carrinho deve ser recalculado excluindo aquele item', function () {
  CarrinhoPage.linhaDoProduto(this.produtoAtual).should('not.exist');
});

Given('que existe exatamente um produto no carrinho', function () {
  ProdutosPage.visitar();
  ProdutosPage.adicionarAoCarrinho('Blue Top');
  ProdutosPage.fecharModalContinuarComprando();
  CarrinhoPage.visitar();
  this.produtoAtual = 'Blue Top';
});

Then('um link {string} para a pagina de produtos deve ser oferecido', (textoLink) => {
  cy.contains('a', textoLink).should('have.attr', 'href').and('include', '/products');
});

Given('que meu carrinho de compras esta vazio', () => {
  cy.clearCookies();
});

Then('o botao {string} nao deve ser exibido', (textoBotao) => {
  cy.contains(textoBotao).should('not.exist');
});
