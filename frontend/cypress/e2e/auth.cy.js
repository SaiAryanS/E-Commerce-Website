describe('Authentication Flow', () => {
  // Use an object to hold the unique user details for both tests
  const user = {};

  before(() => {
    // Create a unique email for each test run to avoid "user already exists" errors
    const uniqueId = Date.now();
    user.email = `testuser${uniqueId}@example.com`;
    user.password = 'Password123!'; // Use a password that meets your criteria
  });

  it('should allow a new user to register successfully', () => {
    // Step 1: Visit the registration page
    cy.visit('/register');

    // Step 2: Fill out the registration form
    cy.get('input[formControlName="email"]').type(user.email);
    cy.get('input[formControlName="password"]').type(user.password);
    cy.get('input[formControlName="confirmPassword"]').type(user.password);

    // Step 3: Submit the form
    cy.get('button[type="submit"]').click();

    // Step 4: Assert registration was successful
    cy.contains('Registration successful! Redirecting to login...').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('should allow the newly registered user to log in', () => {
    // Step 1: Visit the login page
    cy.visit('/login');

    // Step 2: Fill out the login form
    cy.get('input[formControlName="email"]').type(user.email);
    cy.get('input[formControlName="password"]').type(user.password);

    // Step 3: Submit the form and wait for the redirect
    cy.get('button[type="submit"]').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/'); // Asserts redirect to homepage

    // Step 4: Click the hamburger menu to reveal the logout button
    // **THE FIX**: Using the correct .hamburger selector from your CSS
    cy.get('.hamburger').click();

    // Step 5: Assert that the "Logout" button is now visible inside the open menu
    cy.contains('Logout').should('be.visible');
  });
});