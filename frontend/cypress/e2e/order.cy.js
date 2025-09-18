describe('Ordering Process', () => {
  const user = {};
  before(() => {
    // Create a unique user for this test run
    const uniqueId = Date.now();
    user.email = `order-user${uniqueId}@example.com`;
    user.password = 'Password123!';
  });

  beforeEach(() => {
    // Programmatically logs in and restores the session for speed
    cy.session(user.email, () => {
      // Register a new user for a clean test
      cy.visit('/register');
      cy.get('input[formControlName="email"]').type(user.email);
      cy.get('input[formControlName="password"]').type(user.password);
      cy.get('input[formControlName="confirmPassword"]').type(user.password);
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/login');

      // Log in with the new user
      cy.visit('/login');
      cy.get('input[formControlName="email"]').type(user.email);
      cy.get('input[formControlName="password"]').type(user.password);
      cy.get('button[type="submit"]').click();
      cy.url().should('not.include', '/login');
    });
  });

  it('should allow a logged-in user to purchase a product', () => {
    // Step 1: Start on the homepage
    cy.visit('/');

    // Step 2: Click on the first category card
    cy.get('.category-card').first().click();
    cy.url().should('include', '/products/category');

    // Step 3: On the category page, click on the first product
    // ACTION: Confirm '.product-card' is the correct selector
    cy.get('.product-card').first().click();
    cy.url().should('include', '/product/');

    // Step 4: Add the item to the cart
    cy.contains('button', 'Add to Cart').click();

    // Step 5: Go to the shopping cart page
    // ACTION: Confirm '.cart-icon' is the correct selector
    cy.get('.cart-icon').click();
    cy.url().should('include', '/cart');

    // Step 6: On the cart page, click "Proceed to Checkout"
    // This now looks for a button as seen in your screenshot
    cy.contains('Proceed to Checkout').click();
    cy.url().should('include', '/checkout');

    // Step 7: On the Checkout Summary page, click "Place Order"
    cy.contains('button', 'Place Order').click();

    // Step 8: Verify the final order confirmation page
    cy.contains('h1', 'Thank You For Your Order!').should('be.visible');
    cy.contains('button', 'Continue Shopping').should('be.visible');
  });
});