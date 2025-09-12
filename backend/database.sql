CREATE DATABASE IF NOT EXISTS home_office_kit_db;

USE home_office_kit_db;

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  items_included TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample Product Data
INSERT INTO products (name, description, items_included, price, image_url, slug) VALUES
('The Starter Kit', 'Everything you need to get started with a productive home office.', 'Laptop Stand, Ergonomic Mouse, Keyboard Wrist Rest', 99.99, '/assets/images/starter-kit.jpg', 'starter-kit'),
('The Ergonomic Kit', 'Upgrade your comfort and posture for long work sessions.', 'Ergonomic Chair, Adjustable Desk, Monitor Arm', 499.99, '/assets/images/ergonomic-kit.jpg', 'ergonomic-kit'),
('The Tech Kit', 'Boost your productivity with the latest tech gadgets.', '4K Monitor, Mechanical Keyboard, Noise-Cancelling Headphones', 799.99, '/assets/images/tech-kit.jpg', 'tech-kit'),
('The Decor Kit', 'Personalize your space and create an inspiring atmosphere.', 'Desk Plant, Wall Art, Minimalist Desk Lamp', 79.99, '/assets/images/decor-kit.jpg', 'decor-kit');
