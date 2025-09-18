describe('Ordering Process', () => {
  const user = {};
  before(() => {
    // Create a unique user for this test run
    const uniqueId = Date.now();
    user.email = `order-user${uniqueId}@example.com`;
    user.password = 'Password123!';
  });

  beforeEach(() => {
    // Programmatically logs in once and reuses the session for speed and reliability
    cy.session(user.email, () => {
      cy.visit('/register');
      cy.get('input[formControlName="email"]').type(user.email);
      cy.get('input[formControlName="password"]').type(user.password);
      cy.get('input[formControlName="confirmPassword"]').type(user.password);
      cy.get('button[type="submit"]').click();

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

    // Step 2: From the homepage, click on the first category card
    // This selector is taken directly from your HomePageComponent code
    cy.get('.category-card').first().click();
    cy.url().should('include', '/products/category'); // Verify navigation to category page

    // Step 3: On the category page, click on the first product
    // ACTION: You may need to update '.product-card' to your product item selector
    cy.get('.product-card').first().click();
    cy.url().should('include', '/product/'); // Verify navigation to a product detail page

    // Step 4: On the product detail page, add the item to the cart
    cy.contains('button', 'Add to Cart').click();

    // Step 5: Click the cart icon, then proceed to checkout
    // ACTION: You may need to update '.cart-icon'
    cy.get('.cart-icon').click();
    cy.contains('a', 'Proceed to Checkout').click(); // Uses the exact text you described
    cy.url().should('include', '/checkout');

    // Step 6: Fill in the checkout form
    // ACTION: Update these selectors to match your checkout form
    cy.get('input[formControlName="fullName"]').type('Test Customer');
    cy.get('input[formControlName="addressLine1"]').type('123 Test St');
    cy.get('input[formControlName="city"]').type('Testville');
    cy.get('input[formControlName="zipCode"]').type('12345');

    // Step 7: Place the order
    cy.contains('button', 'Place Order').click();

    // Step 8: Verify the order confirmation page
    // This looks for the exact text you described on the final page
    cy.contains('h1', 'Thank You For Your Order').should('be.visible');
    cy.contains('a', 'Continue Shopping').should('be.visible');
  });
});