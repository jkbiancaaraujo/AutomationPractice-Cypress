// separa clear/type em comandos distintos: evita encadear uma acao no meio da chain (cypress/unsafe-to-chain-command)
export function limparEDigitar(seletor, valor, options = {}) {
  cy.get(seletor).clear();
  cy.get(seletor).type(valor, options);
}
