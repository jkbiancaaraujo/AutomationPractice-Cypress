import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { CadastroPage, HeaderPage } from '../../support/pages';
import { UsuarioFactory } from '../../support/factories';

When(
  'eu informo um nome e um e-mail unicos gerados dinamicamente no formulario {string}',
  function (nomeFormulario) {
    cy.contains(nomeFormulario).should('be.visible');

    const { nome, email } = UsuarioFactory.gerarNomeEEmail();

    CadastroPage.preencherDadosIniciais(nome, email);
    this.nomeGerado = nome;
    this.emailGerado = email;
  }
);

Then('eu devo ser direcionado para a pagina {string}', (nomePagina) => {
  CadastroPage.tituloDaPagina(nomePagina).should('be.visible');
});

When('eu preencho as informacoes obrigatorias da conta com dados validos e dinamicos', function () {
  const [primeiroNome, ...resto] = this.nomeGerado.split(' ');

  CadastroPage.preencherContaCompleta(
    UsuarioFactory.gerarDadosDaConta(primeiroNome, resto.join(' '))
  );
});

Then('eu devo estar autenticado automaticamente', () => {
  HeaderPage.estaLogado().should('be.visible');
});

Given('que ja existe uma conta cadastrada com um e-mail conhecido', () => {
  expect(Cypress.env('userEmail'), 'CYPRESS_USER_EMAIL configurado no .env').to.be.a('string').and
    .not.be.empty;
});

When(
  'eu informo um nome qualquer e o e-mail ja cadastrado no formulario {string}',
  function (nomeFormulario) {
    cy.contains(nomeFormulario).should('be.visible');
    CadastroPage.preencherDadosIniciais(
      UsuarioFactory.gerarNomeEEmail().nome,
      Cypress.env('userEmail')
    );
  }
);

When('eu clico no botao {string} sem preencher nome e e-mail', () => {
  CadastroPage.clicarBotaoSignup();
});

When('eu preencho as informacoes da conta deixando o campo {string} em branco', function (campo) {
  const overrides = campo === 'Password' ? { senha: '' } : {};
  CadastroPage.preencherContaCompleta(overrides);
});

Then('eu devo permanecer na pagina {string}', (nomePagina) => {
  CadastroPage.tituloDaPagina(nomePagina).should('be.visible');
});
