describe('Charts page', {
    defaultCommandTimeout: 100000
  }, () => {
  it('Logs in and goes to charts page', () => {
    cy.visit('http://localhost:3000/')
    cy.get('.flex-between > .flex-center > :nth-child(1)').click() // Login page

    cy.url().should('eq', 'http://localhost:3000/login');

    cy.get('#username').type('Testing')
    cy.get('#password').type('Testing')
    cy.get('div.mt-2 > .w-full').click() // Login button

    cy.url().should('eq', 'http://localhost:3000/projectCreation');

    cy.get('[title="Charts"]').click(); // Go to Charts page button

    cy.get('#formSelector').select(1).invoke('val').should('eq', 'Testing');

    cy.get('#roles-0').click();
    cy.get('#roles-1').click();

    cy.get('#questions-0').click();
    cy.get('#questions-1').click();
    cy.get('#questions-2').click();
    cy.get('#questions-3').click();
    cy.get('#questions-4').click();

    cy.get('button[title="submitButton"]').click(); // Submit button

    cy.url().should('contain', 'http://localhost:3000/Testing/Testing/chartsPage').wait(10000);

    cy.get('div:nth-child(1) > .space-x-5 > li > .mt-10').contains('Testing - Role Question (Radio Buttons)')
    cy.get('div:nth-child(2) > .space-x-5 > li > .mt-10').contains('Testing - Option Question (Checkboxes)')
    cy.get('div:nth-child(3) > .space-x-5 > li > .mt-10').contains('Testing - Slider (Agree/Disagree)')
    cy.get('div:nth-child(4) > .space-x-5 > li > .mt-10').contains('Testing - Slider (Number values)')
    cy.get('div:nth-child(5) > .space-x-5 > li > .mt-10').contains('Testing - Text Input')

    /*
    cy.contains('h1', 'Testing - Role Question (Radio Buttons)')
    cy.contains('h1', 'Testing - Option Question (Checkboxes)')
    cy.contains('h1', 'Testing - Slider (Agree/Disagree)')
    cy.contains('h1', 'Testing - Slider (Number values)')
    cy.contains('h1', 'Testing - Text Input')
    */
  })
})