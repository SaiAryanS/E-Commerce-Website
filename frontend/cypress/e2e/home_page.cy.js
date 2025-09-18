describe('The Home Page', () => {
  it('successfully loads and contains the title', () => {
    // Step 1: Visit the root URL of the site
    cy.visit('/');

    // Step 2: Find an element that contains the text "PC Parts"
    // and assert that it is visible. This confirms the page loaded.
    cy.contains('PC Parts').should('be.visible');
  });
});