class CadastroPage {
  preencherDadosIniciais(nome, email) {
    cy.get('input[data-qa="signup-name"]').clear().type(nome);
    cy.get('input[data-qa="signup-email"]').clear().type(email);
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
    cy.get('input[data-qa="first_name"]').clear().type(dados.primeiroNome);
    cy.get('input[data-qa="last_name"]').clear().type(dados.ultimoNome);
    cy.get('input[data-qa="address"]').clear().type(dados.endereco);
    cy.get('select[data-qa="country"]').select('India');
    cy.get('input[data-qa="state"]').clear().type(dados.estado);
    cy.get('input[data-qa="city"]').clear().type(dados.cidade);
    cy.get('input[data-qa="zipcode"]').clear().type(dados.cep);
    cy.get('input[data-qa="mobile_number"]').clear().type(dados.telefone);
  }

  tituloDaPagina(texto) {
    return cy.contains('h2', texto);
  }
}

export default new CadastroPage();
