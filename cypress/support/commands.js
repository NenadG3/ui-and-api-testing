/// <reference types="cypress" />

Cypress.Commands.add('getBySel', (selector, ...args)=> {
    return cy.get(`[data-test=${selector}]`, ...args)
  })

Cypress.Commands.add('openShoppingCart', ()=> {
    cy.get('.shopping_cart_link').click();
  })

Cypress.Commands.add('createUser', ()=> {
    cy.request({
      method: 'POST',
      url: Cypress.env('gorestUrl') + '/public/v2/users',
      headers: {
          'Authorization': 'Bearer ' + Cypress.env('authToken')
              },
      body: {
          name: 'John',
          email: Math.random().toString(5).substring(2)+'@example',
          gender: 'male',
          status: 'active'
          }
    })
  })

