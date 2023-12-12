describe('About Us page', {
    defaultCommandTimeout: 100000
  }, () => {
  it('Navigates to About Us page', () => {
    cy.visit('http://localhost:3000/')
    cy.get('.flex-center > :nth-child(3)').click() // About us page

    cy.url().should('eq', 'http://localhost:3000/about');
  })
})