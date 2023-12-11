describe('Login page', {
  defaultCommandTimeout: 100000
}, () => {
it('Navigates to Login page and tries to login with user; "Testing"', () => {
  cy.visit('http://localhost:3000/')
  cy.get('.flex-between > .flex-center > :nth-child(1)').click() // Login page

  cy.url().should('eq', 'http://localhost:3000/login');

  cy.get('#username').type('Testing')
  cy.get('#password').type('Testing')
  cy.get('div.mt-2 > .w-full').click() // Login button

  cy.url().should('eq', 'http://localhost:3000/projectCreation');
})
})