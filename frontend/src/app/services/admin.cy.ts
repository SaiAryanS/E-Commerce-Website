describe('Admin Panel Functionality', () => {
  const adminUser = 'admin';
  const adminPass = 'root';

  beforeEach(() => {
    // Programmatically log in as admin before each test.
    cy.request('POST', '/api/auth/admin/login', {
      username: adminUser,
      password: adminPass,
    }).then((response) => {
      window.localStorage.setItem('token', response.body.token);
    });

    // Now visit the admin page directly as a logged-in admin
    cy.visit('/admin/products');
  });

  it('should allow an admin to add and then delete a product', () => {
    const newProductName = `Test Product ${Date.now()}`;
    const newProductPrice = '99.99';
    const newProductImage = 'https://example.com/test-image.jpg';

    cy.contains('Add Product').should('be.visible');

    // Note: Add data-cy attributes to your admin form fields for stability.
    cy.get('input[formcontrolname="name"]').type(newProductName);
    cy.get('textarea[formcontrolname="description"]').type('A test description.');
    cy.get('input[formcontrolname="price"]').type(newProductPrice);
    cy.get('input[formcontrolname="imageUrl"]').type(newProductImage);
    cy.get('button[type="submit"]').contains('Add Product').click();

    // Verify it appears in the admin list
    cy.get('.product-list').contains(newProductName).should('be.visible');

    // Verify it appears on the public homepage
    cy.visit('/');
    cy.get('.product-card').contains(newProductName).should('be.visible');

    // Go back to the admin panel to clean up
    cy.visit('/admin/products');
    cy.contains('.product-list-item', newProductName).find('button', 'Delete').click();
    cy.contains(newProductName).should('not.exist');
  });
});