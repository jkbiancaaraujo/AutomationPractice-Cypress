import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { faker } from '@faker-js/faker';
import { CadastroPage, HeaderPage } from '../../support/pages';

When('eu informo um nome e um e-mail unicos gerados dinamicamente no formulario {string}', function (nomeFormulario) {
  cy.contains(nomeFormulario).should('be.visible');

  const nome = faker.person.fullName();
  const email = `qa.${Date.now()}.${faker.string.alphanumeric(6)}@example.com`;

  CadastroPage.preencherDadosIniciais(nome, email);
  this.nomeGerado = nome;
  this.emailGerado = email;
});

Then('eu devo ser direcionado para a pagina {string}', (nomePagina) => {
  CadastroPage.tituloDaPagina(nomePagina).should('be.visible');
});

When('eu preencho as informacoes obrigatorias da conta com dados validos e dinamicos', function () {
  const [primeiroNome, ...resto] = this.nomeGerado.split(' ');

  CadastroPage.preencherContaCompleta({
    senha: `Senha!${faker.string.alphanumeric(6)}`,
    primeiroNome,
    ultimoNome: resto.join(' ') || 'Teste',
    endereco: faker.location.streetAddress(),
    estado: faker.location.state(),
    cidade: faker.location.city(),
    cep: faker.location.zipCode(),
    telefone: faker.phone.number(),
  });
});

Then('eu devo estar autenticado automaticamente', () => {
  HeaderPage.estaLogado().should('be.visible');
});

Given('que ja existe uma conta cadastrada com um e-mail conhecido', () => {
});

When('eu informo um nome qualquer e o e-mail ja cadastrado no formulario {string}', function (nomeFormulario) {
  cy.contains(nomeFormulario).should('be.visible');
  CadastroPage.preencherDadosIniciais(faker.person.fullName(), Cypress.env('userEmail'));
});

When('eu clico no botao {string} sem preencher nome e e-mail', () => {
  cy.get('button[data-qa="signup-button"]').click({ force: true });
});

When('eu preencho as informacoes da conta deixando o campo {string} em branco', function (campo) {
  const overrides = campo === 'Password' ? { senha: '' } : {};
  CadastroPage.preencherContaCompleta(overrides);
});

Then('eu devo permanecer na pagina {string}', (nomePagina) => {
  CadastroPage.tituloDaPagina(nomePagina).should('be.visible');
});
