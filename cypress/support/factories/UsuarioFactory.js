import { faker } from '@faker-js/faker';

class UsuarioFactory {
  gerarNomeEEmail() {
    const nome = faker.person.fullName();
    const email = `qa.${Date.now()}.${faker.string.alphanumeric(6)}@example.com`;

    return { nome, email };
  }

  gerarDadosDaConta(primeiroNome, ultimoNome) {
    return {
      senha: `Senha!${faker.string.alphanumeric(6)}`,
      primeiroNome,
      ultimoNome: ultimoNome || 'Teste',
      endereco: faker.location.streetAddress(),
      estado: faker.location.state(),
      cidade: faker.location.city(),
      cep: faker.location.zipCode(),
      telefone: faker.phone.number(),
    };
  }
}

export default new UsuarioFactory();
