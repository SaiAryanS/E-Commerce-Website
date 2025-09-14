-- Drop the database if it exists to start fresh (optional, good for development)
DROP DATABASE IF EXISTS home_office_kit_db;

-- Create the database
CREATE DATABASE home_office_kit_db;

-- Select the database to use
USE home_office_kit_db;

-- Table for user accounts (login and registration)
-- No changes needed here.
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for products available for sale
-- No changes needed here.
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    slug VARCHAR(255) NOT NULL UNIQUE
);

-- NEW TABLE: Represents a single transaction or order placed by a user.
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    -- This creates a link between the 'orders' table and the 'users' table.
    -- It ensures that every order belongs to a valid user.
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- NEW TABLE: A list of all items included in a specific order.
-- This is the "join" table that links orders and products.
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price_at_purchase DECIMAL(10, 2) NOT NULL,
    -- This links each item to its parent order.
    FOREIGN KEY (order_id) REFERENCES orders(id),
    -- This links each item to the actual product.
    FOREIGN KEY (product_id) REFERENCES products(id)
);


-- Sample Product Data (simplified from your original for clarity)
INSERT INTO products (name, description, price, image_url, slug) VALUES
('The Starter Kit', 'Everything you need to get started.', 99.99, '/assets/images/starter-kit.jpg', 'starter-kit'),
('The Ergonomic Kit', 'Upgrade your comfort and posture.', 499.99, '/assets/images/ergonomic-kit.jpg', 'ergonomic-kit'),
('The Tech Kit', 'Boost your productivity with tech gadgets.', 799.99, '/assets/images/tech-kit.jpg', 'tech-kit'),
('The Decor Kit', 'Personalize your space.', 79.99, '/assets/images/decor-kit.jpg', 'decor-kit');
