import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { ProdutosPage } from '../../support/pages';

When('eu pesquiso pelo termo {string}', function (termo) {
  ProdutosPage.pesquisar(termo);
  this.termoPesquisado = termo;
});

When('eu pesquiso pelo termo {string} em letras maiusculas', function (termo) {
  ProdutosPage.pesquisar(termo);
  ProdutosPage.nomesDosProdutos().then(($els) => {
    this.resultadoMaiusculas = Array.prototype.slice.call($els).map((el) => el.textContent.trim()).sort();
  });
});

When('eu pesquiso pelo termo {string} em letras minusculas', function (termo) {
  ProdutosPage.visitar();
  ProdutosPage.pesquisar(termo);
  ProdutosPage.nomesDosProdutos().then(($els) => {
    this.resultadoMinusculas = Array.prototype.slice.call($els).map((el) => el.textContent.trim()).sort();
  });
});

Then('os dois resultados devem conter exatamente os mesmos produtos', function () {
  expect(this.resultadoMinusculas).to.deep.equal(this.resultadoMaiusculas);
});

Then('a secao {string} deve ser exibida', (secao) => {
  cy.contains(secao).should('be.visible');
});

Then('pelo menos um produto retornado deve conter o termo pesquisado no nome', function () {
  const termo = this.termoPesquisado.toLowerCase();

  ProdutosPage.nomesDosProdutos().should('have.length.greaterThan', 0);
  ProdutosPage.nomesDosProdutos().then(($els) => {
    const algumRelevante = Array.prototype.slice.call($els).some((el) => el.textContent.toLowerCase().includes(termo));
    // A busca do site relaciona produtos tambem por categoria, entao nem todo
    // resultado contem o termo literalmente no nome (ex: buscar "Top" tambem
    // retorna "Little Girls Mr. Panda Shirt", da categoria Tops).
    expect(algumRelevante, `esperava ao menos um produto com "${termo}" no nome entre os resultados`).to.be.true;
  });
});

When('eu pesquiso por um termo aleatorio que nao corresponde a nenhum produto do catalogo', () => {
  const termoInexistente = `zzz-produto-inexistente-${Date.now()}`;
  ProdutosPage.pesquisar(termoInexistente);
});

Then('nenhum produto deve ser listado no resultado', () => {
  ProdutosPage.produtosListados().should('not.exist');
});

When('eu clico no botao de busca sem preencher o campo de pesquisa', () => {
  ProdutosPage.limparCampoBusca();
  ProdutosPage.clicarBotaoBuscar();
});

Then('a pagina deve exibir a listagem {string}', (nomeListagem) => {
  cy.contains(nomeListagem).should('be.visible');
});

Then('nenhum erro deve ser apresentado ao usuario', () => {
  cy.get('body').should('not.contain', 'Error');
  ProdutosPage.produtosListados().its('length').should('be.gte', 1);
});
