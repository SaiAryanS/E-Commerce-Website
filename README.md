# The Home Office Kit - 3-Tier E-Commerce Application

This is a complete, functional, 3-tier e-commerce web application built with Angular, Express.js, and MySQL.

## Project Concept

A minimalist website named "The Home Office Kit" that sells curated, themed boxes for home office setups. The application includes user registration/login, a working shopping cart, and a secure admin panel for product management.

## Tech Stack

*   **Presentation Tier (Frontend):** Angular
*   **Application Tier (Backend):** Express.js
*   **Data Tier (Database):** MySQL

## Features

*   User registration and login
*   JWT-based authentication
*   Admin panel for product management (add/remove products)
*   Shopping cart with persistent state (localStorage)
*   Lazy-loaded admin module
*   Minimalist design

## Setup and Installation Guide

### 1. Database Setup

1.  Ensure you have MySQL installed and running on your machine.
2.  Log in to your MySQL server and execute the script found in `backend/database.sql`. This will create the `home_office_kit_db` database, the `products` and `users` tables, and populate the `products` table with sample data.

    ```bash
    mysql -u your_username -p < backend/database.sql
    ```

### 2. Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Create a `.env` file by copying the example file:
    ```bash
    cp .env.example .env
    ```
3.  Open the `.env` file and update the following variables with your credentials:
    ```
    DB_HOST=localhost
    DB_USER=your_mysql_username
    DB_PASSWORD=your_mysql_password
    DB_NAME=home_office_kit_db

    JWT_SECRET=a_very_strong_and_secret_key

    ADMIN_USERNAME=admin
    ADMIN_PASSWORD=a_secure_password
    ```
4.  Install the backend dependencies:
    ```bash
    npm install
    ```
5.  Start the backend server:
    ```bash
    npm start
    ```
    The API will be running at `http://localhost:3000`.

### 3. Frontend Setup

1.  Navigate to the `frontend` directory:
    ```bash
    cd ../frontend
    ```
2.  Install the frontend dependencies:
    ```bash
    npm install
    ```
3.  Start the Angular development server:
    ```bash
    npm start
    ```
4.  Open your browser and navigate to `http://localhost:4200` to see the application.

## API Documentation

### Public Routes

*   `GET /api/products`: Retrieve a list of all product kits.
*   `GET /api/products/:id`: Retrieve a single product kit.

### Authentication Routes

*   `POST /api/auth/register`: Create a new user.
*   `POST /api/auth/login`: Authenticate a standard user and return a JWT.
*   `POST /api/auth/admin/login`: Authenticate the admin and return a JWT with admin privileges.

### Protected Admin Routes

*These routes require a valid admin JWT in the `Authorization` header (`Bearer <token>`).*

*   `POST /api/products`: Add a new product to the database.
*   `DELETE /api/products/:id`: Remove a product from the database.
