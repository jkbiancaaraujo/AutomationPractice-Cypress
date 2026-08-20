class TrelloApi {
  constructor() {
    this.baseUrl = 'https://api.trello.com/1';
  }

  buscarAcaoPorId(idDaAcao) {
    return cy.request({
      method: 'GET',
      url: `${this.baseUrl}/actions/${idDaAcao}`,
      failOnStatusCode: false,
    });
  }
}

export default new TrelloApi();
