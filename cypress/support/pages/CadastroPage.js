import { limparEDigitar } from './utils';

class CadastroPage {
  preencherDadosIniciais(nome, email) {
    limparEDigitar('input[data-qa="signup-name"]', nome);
    limparEDigitar('input[data-qa="signup-email"]', email);
  }

  clicarBotaoSignup() {
    cy.get('button[data-qa="signup-button"]').click({ force: true });
  }

  preencherContaCompleta(overrides = {}) {
    const dados = {
      senha: `Senha!${Date.now()}`,
      diaNascimento: '10',
      mesNascimento: 'January',
      anoNascimento: '1995',
      primeiroNome: 'Usuario',
      ultimoNome: 'Teste',
      endereco: 'Rua de Teste, 123',
      estado: 'SP',
      cidade: 'Sao Paulo',
      cep: '00000000',
      telefone: '11999999999',
      ...overrides,
    };

    cy.get('#id_gender1').check({ force: true });
    cy.get('input[data-qa="password"]').clear();
    if (dados.senha) {
      cy.get('input[data-qa="password"]').type(dados.senha, { log: false });
    }
    cy.get('select[data-qa="days"]').select(dados.diaNascimento);
    cy.get('select[data-qa="months"]').select(dados.mesNascimento);
    cy.get('select[data-qa="years"]').select(dados.anoNascimento);
    limparEDigitar('input[data-qa="first_name"]', dados.primeiroNome);
    limparEDigitar('input[data-qa="last_name"]', dados.ultimoNome);
    limparEDigitar('input[data-qa="address"]', dados.endereco);
    cy.get('select[data-qa="country"]').select('India');
    limparEDigitar('input[data-qa="state"]', dados.estado);
    limparEDigitar('input[data-qa="city"]', dados.cidade);
    limparEDigitar('input[data-qa="zipcode"]', dados.cep);
    limparEDigitar('input[data-qa="mobile_number"]', dados.telefone);
  }

  tituloDaPagina(texto) {
    return cy.contains('h2', texto);
  }
}

export default new CadastroPage();
