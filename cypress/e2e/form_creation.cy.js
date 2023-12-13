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

    cy.get('form > a').click() // Goes into "Testing" project

    cy.url().should('eq', 'http://localhost:3000/Testing/Testing');

    cy.get('button[title="New"]').click(); // Create new form
    cy.get('a[title="FormButton"]').click(); // Go to form creation page

    cy.url().should('eq', 'http://localhost:3000/Testing/Testing/formCreator/newForm').wait(10000);

    cy.get('input[aria-label="Form name"]').focus().clear().should('have.value', '').type('Testing');
    cy.get('input[aria-label="Form description"]').focus().clear().should('have.value', '').type('Testing');
    
    cy.get('button[data-slot="trigger"]').click(); // Adds new question
    cy.get('li[data-key="mchoice"]').click(); // Multiple choice question
    cy.get('button[data-slot="trigger"]').click(); // Adds new question
    cy.get('li[data-key="mchoice"]').click(); // Multiple choice question
    cy.get('button[data-slot="trigger"]').click(); // Adds new question
    cy.get('li[data-key="slider"]').click(); // Slider question
    cy.get('button[data-slot="trigger"]').click(); // Adds new question
    cy.get('li[data-key="slider"]').click(); // Slider question
    cy.get('button[data-slot="trigger"]').click(); // Adds new question
    cy.get('li[data-key="input"]').click(); // Input question

    cy.get('ul > li:nth-child(1) > .flex > .relative > .inline-flex > input[aria-label="Question name"]').focus().clear().should('have.value', '').type('Testing - Role Question (Radio Buttons)');
    cy.get('ul > li:nth-child(1) > label:nth-child(3) > span:nth-child(2)').click(); // Required
    cy.get('ul > li:nth-child(1) > label:nth-child(4) > span:nth-child(2)').click(); // Show answers to respondents
    //cy.get('ul > li:nth-child(1) > label:nth-child(5) > span:nth-child(2)').click(); // Allow multiple options checked
    cy.get('ul > li:nth-child(1) > label:nth-child(6) > span:nth-child(2)').click(); // Use question to determine roles
    cy.contains('ul > li:nth-child(1) > button', 'Add option').click(); // Add option
    cy.contains('ul > li:nth-child(1) > button', 'Add option').click(); // Add option
    cy.get('ul > li:nth-child(1) > ul:nth-child(7) > div > div > div > div > input').focus().clear().should('have.value', '').type('Role 1');
    cy.get('ul > li:nth-child(1) > ul:nth-child(8) > div > div > div > div > input').focus().clear().should('have.value', '').type('Role 2');

    cy.get('ul > li:nth-child(2) > .flex > .relative > .inline-flex > input[aria-label="Question name"]').focus().clear().should('have.value', '').type('Testing - Option Question (Checkboxes)');
    cy.get('ul > li:nth-child(2) > label:nth-child(3) > span:nth-child(2)').click(); // Required
    cy.get('ul > li:nth-child(2) > label:nth-child(4) > span:nth-child(2)').click(); // Show answers to respondents
    cy.get('ul > li:nth-child(2) > label:nth-child(5) > span:nth-child(2)').click(); // Allow multiple options checked
    //cy.get('ul > li:nth-child(2) > label:nth-child(6) > span:nth-child(2)').click(); // Use question to determine roles
    cy.contains('ul > li:nth-child(2) > button', 'Add option').click(); // Add option
    cy.contains('ul > li:nth-child(2) > button', 'Add option').click(); // Add option
    cy.get('ul > li:nth-child(2) > ul:nth-child(7) > div > div > div > div > input').focus().clear().should('have.value', '').type('Option 1');
    cy.get('ul > li:nth-child(2) > ul:nth-child(8) > div > div > div > div > input').focus().clear().should('have.value', '').type('Option 2');

    cy.get('ul > li:nth-child(3) > .flex > .relative > .inline-flex > input[aria-label="Question name"]').focus().clear().should('have.value', '').type('Testing - Slider (Agree/Disagree)');
    cy.get('ul > li:nth-child(3) > label:nth-child(3) > span:nth-child(2)').click(); // Required
    cy.get('ul > li:nth-child(3) > label:nth-child(4) > span:nth-child(2)').click(); // Show answers to respondents
    cy.get('ul > li:nth-child(3) > div:nth-child(5) > div > div > input').focus().clear().should('have.value', '').type('9');
    cy.get('ul > li:nth-child(3) > div:nth-child(6) > div > label:nth-child(1) > span:nth-child(2)').click(); // Agree/Disagree
    //cy.get('ul > li:nth-child(3) > div:nth-child(6) > div > label:nth-child(2) > span:nth-child(2)').click(); // Number values

    cy.get('ul > li:nth-child(4) > .flex > .relative > .inline-flex > input[aria-label="Question name"]').focus().clear().should('have.value', '').type('Testing - Slider (Number values)');
    cy.get('ul > li:nth-child(4) > label:nth-child(3) > span:nth-child(2)').click(); // Required
    cy.get('ul > li:nth-child(4) > label:nth-child(4) > span:nth-child(2)').click(); // Show answers to respondents
    cy.get('ul > li:nth-child(4) > div:nth-child(5) > div > div > input').focus().clear().should('have.value', '').type('5');
    //cy.get('ul > li:nth-child(4) > div:nth-child(6) > div > label:nth-child(1) > span:nth-child(2)').click(); // Agree/Disagree
    cy.get('ul > li:nth-child(4) > div:nth-child(6) > div > label:nth-child(2) > span:nth-child(2)').click(); // Number values

    cy.get('ul > li:nth-child(5) > .flex > .relative > .inline-flex > input[aria-label="Question name"]').focus().clear().should('have.value', '').type('Testing - Text Input');
    cy.get('ul > li:nth-child(5) > label:nth-child(3) > span:nth-child(2)').click(); // Required
    cy.get('ul > li:nth-child(5) > label:nth-child(4) > span:nth-child(2)').click(); // Show answers to respondents

    cy.contains('div.flex.flex-wrap.content-evenly > button', 'Save form').click(); // Save form
    //cy.contains('div.flex.flex-wrap.content-evenly > button', 'Delete form').click(); // Delete form
    //cy.contains('div.flex.flex-wrap.content-evenly > button', 'Go back to forms').click(); // Go back to forms

    cy.get('input[aria-label="How many people should answer this form?"]').focus().clear().should('have.value', '').type('1')
    cy.contains('section button', 'Publish form').click(); // Publish form
    //cy.contains('section button', 'Save without publishing').click(); // Save without publishing
    //cy.contains('section button', 'Don\'t save').click(); // Don't save

    cy.url().should('eq', 'http://localhost:3000/Testing/Testing/formCreator/newForm')
  })
})