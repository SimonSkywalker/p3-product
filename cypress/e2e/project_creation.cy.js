describe('Project creation page', {
    defaultCommandTimeout: 100000
  }, () => {
  it('Login and create a new project', () => {
    cy.visit('http://localhost:3000/')
    cy.get('.flex-between > .flex-center > :nth-child(1)').click() // Login page

    cy.url().should('eq', 'http://localhost:3000/login');

    cy.get('#username').type('Testing')
    cy.get('#password').type('Testing')
    cy.get('div.mt-2 > .w-full').click() // Login button

    cy.url().should('eq', 'http://localhost:3000/projectCreation');

    cy.get('.text-5xl').click() // Create new project
    cy.get('input.block.w-full.px-4.py-2').type('Testing')
    cy.get('.w-10').click();
    cy.get('div.grid.grid-cols-3 > div:nth-child(9) > label > input').click({ force: true });
    cy.get('button[title="submitButton"]').click();
    cy.get('button.p-0.m-0').click();

    cy.url().should('contain', 'http://localhost:3000/projectCreation');

    cy.get('.Toastify__toast-body > :nth-child(2)').contains('Created Project: Testing');

    cy.get('[title="Project"]').should('have.attr', 'src').should('eq','/icons/github.svg')

    cy.get('[title="Charts"]')
    cy.get('[title="Archive"]')
    cy.get('[title="Delete"]')
    cy.get('[title="Edit"]')
  })
})