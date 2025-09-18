describe('Admin Panel Functionality', () => {
  const adminUser = 'admin'; // From backend/.env
  const adminPass = 'root';   // From backend/.env

  beforeEach(() => {
    // Programmatically log in as admin before each test.
    cy.request('POST', '/api/auth/admin/login', {
      username: adminUser,
      password: adminPass,
    }).then((response) => {
      window.localStorage.setItem('token', response.body.token); // Store the JWT token
    });

    // Now visit the admin page directly as a logged-in admin
    cy.visit('/admin/products');
  });

  it('should allow an admin to add and then delete a product', () => {
    const newProductName = `Test Product ${Date.now()}`; // Unique name for each run
    const newProductPrice = '99.99';
    const newProductImage = 'https://example.com/test-image.jpg'; // Placeholder image URL

    cy.contains('Add Product').should('be.visible');

    // **ACTION REQUIRED:** Add `data-cy` attributes to these form fields for stability.
    cy.get('input[formcontrolname="name"]').type(newProductName);
    cy.get('textarea[formcontrolname="description"]').type('A test description.');
    cy.get('input[formcontrolname="price"]').type(newProductPrice);
    cy.get('input[formcontrolname="imageUrl"]').type(newProductImage);
    cy.get('button[type="submit"]').contains('Add Product').click();

    // Verify it appears in the admin product list (assuming .product-list is the container)
    cy.get('.product-list').contains(newProductName).should('be.visible'); // **ACTION REQUIRED:** Add `data-cy="product-list"` to the product list container.

    // Verify it appears on the public homepage (after adding)
    cy.visit('/');
    cy.get('.product-card').contains(newProductName).should('be.visible');

    // Go back to the admin panel to clean up the created product
    cy.visit('/admin/products');
    // **ACTION REQUIRED:** Add `data-cy="delete-product-button"` to the delete button for stability.
    cy.contains('.product-list-item', newProductName).find('button').contains('Delete').click(); // Assumes .product-list-item is the row/card for a product.
    cy.contains(newProductName).should('not.exist');
  });
});