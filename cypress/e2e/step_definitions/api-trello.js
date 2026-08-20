import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { TrelloApi } from '../../support/api';

const REGEX_OBJECT_ID_TRELLO = /^[0-9a-f]{24}$/;

When('eu envio um GET para a acao {string} da API do Trello', function (idDaAcao) {
  this.idDaAcaoSolicitada = idDaAcao;
  TrelloApi.buscarAcaoPorId(idDaAcao).then((resposta) => {
    this.respostaApi = resposta;
  });
});

Then('o status code da resposta deve ser {int}', function (statusEsperado) {
  expect(this.respostaApi.status).to.equal(statusEsperado);
});

Then('o nome da lista da resposta deve ser exibido', function () {
  const nomeDaLista = this.respostaApi.body.data.list.name;

  expect(nomeDaLista, 'campo "name" da estrutura "list"').to.be.a('string').and.not.be.empty;
  cy.log(`Nome da lista: ${nomeDaLista}`);
});

Then('a resposta deve respeitar o contrato esperado de uma acao do Trello', function () {
  const acao = this.respostaApi.body;

  expect(this.respostaApi.headers['content-type'], 'Content-Type da resposta').to.include(
    'application/json'
  );

  expect(acao).to.include.all.keys('id', 'idMemberCreator', 'type', 'date', 'data');
  expect(acao.id, 'id da acao deve ser o mesmo solicitado').to.equal(this.idDaAcaoSolicitada);
  expect(acao.id, 'id deve ser um ObjectId valido do Trello (24 chars hexadecimais)').to.match(
    REGEX_OBJECT_ID_TRELLO
  );
  expect(acao.type).to.be.a('string').and.not.be.empty;
  expect(new Date(acao.date).toString(), 'campo "date" deve ser uma data ISO valida').to.not.equal(
    'Invalid Date'
  );
  expect(acao.data, 'campo "data"').to.be.an('object');

  const { list, board, card } = acao.data;

  expect(list, 'estrutura "list"').to.include.all.keys('id', 'name');
  expect(list.id).to.match(REGEX_OBJECT_ID_TRELLO);
  expect(list.name).to.be.a('string').and.not.be.empty;

  expect(board, 'estrutura "board"').to.include.all.keys('id', 'name');
  expect(board.id).to.match(REGEX_OBJECT_ID_TRELLO);
  expect(board.name).to.be.a('string').and.not.be.empty;

  expect(card, 'estrutura "card"').to.include.all.keys('id', 'name');
  expect(card.id).to.match(REGEX_OBJECT_ID_TRELLO);
  expect(card.name).to.be.a('string').and.not.be.empty;
});
