describe('Register page', () => {
  it('Navigates to Register page and creates a user; "Testing"', () => {
    cy.visit('http://localhost:3000/')
    cy.get('.flex-between > .flex-center > :nth-child(2)').click() // Register page

    cy.url().should('eq', 'http://localhost:3000/register');

    cy.get('#username').type('Testing')
    cy.get('#password').type('Testing')
    cy.get('#repeatPassword').type('Testing')
    cy.get('div.mt-2 > .w-full').click() // Register button

    cy.get('.Toastify__toast-body > :nth-child(2)').contains('Registered Testing')
  })
})
