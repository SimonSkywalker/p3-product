describe('Form Answering page', {
    defaultCommandTimeout: 100000
  }, () => {
  it('Navigates to Form Answering page', () => {
    let tokenId = 'J8dETKIhpQ'
    cy.visit('http://localhost:3000/Testing/Testing/Testing/' + tokenId);

    cy.url().should('eq', 'http://localhost:3000/Testing/Testing/Testing/' + tokenId);

    cy.get('.float-right').click(); // Let's go button
    
    cy.url().should('eq', 'http://localhost:3000/Testing/Testing/Testing/' + tokenId);

    cy.get('#option-1').click(); // Select Role 2
    cy.contains('button', 'Next').click(); // Next button
    
    cy.url().should('eq', 'http://localhost:3000/Testing/Testing/Testing/' + tokenId);

    cy.get('#option-0').click(); // Select Option 1
    cy.get('#option-1').click(); // Select Option 2
    cy.contains('button', 'Next').click(); // Next button

    cy.url().should('eq', 'http://localhost:3000/Testing/Testing/Testing/' + tokenId);

    cy.get('[style="left: 100%; transform: translateX(-50%);"]').click(); // Strongly Agree
    cy.contains('button', 'Next').click(); // Next button

    cy.url().should('eq', 'http://localhost:3000/Testing/Testing/Testing/' + tokenId);

    cy.get('.rc-slider-step > [style="left: 100%; transform: translateX(-50%);"]').click(); // Select 5
    cy.contains('button', 'Next').click(); // Next button

    cy.url().should('eq', 'http://localhost:3000/Testing/Testing/Testing/' + tokenId);

    cy.get('textarea').focus().clear().should('have.value', '').type('Testing');
    cy.contains('button', 'Submit').click(); // Submit button

    cy.url().should('eq', 'http://localhost:3000/Testing/Testing/Testing/' + tokenId);

    cy.contains('button', 'Submit My Answers').click(); // Submit My Answers button

    cy.url().should('eq', 'http://localhost:3000/Testing/Testing/Testing/' + tokenId);
  })
})