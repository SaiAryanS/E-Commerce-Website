# Pc Parts - 3-Tier E-Commerce Application

This is a complete, functional, 3-tier e-commerce web application built with Angular, Express.js, and MySQL. The project is fully automated with a CI/CD pipeline that builds, tests, and deploys the application to a Kubernetes cluster.

## Table of Contents

  - [Tech Stack](https://www.google.com/search?q=%23tech-stack)
  - [Features](https://www.google.com/search?q=%23features)
  - [CI/CD Pipeline with Jenkins](https://www.google.com/search?q=%23cicd-pipeline-with-jenkins)
  - [End-to-End Testing with Cypress](https://www.google.com/search?q=%23end-to-end-testing-with-cypress)
  - [Running with Docker (Local Development)](https://www.google.com/search?q=%23running-with-docker-local-development)
  - [Kubernetes Deployment (Minikube)](https://www.google.com/search?q=%23kubernetes-deployment-minikube)
  - [Manual Setup Guide](https://www.google.com/search?q=%23manual-setup-guide)
  - [API Documentation](https://www.google.com/search?q=%23api-documentation)

## Tech Stack

  * **Presentation Tier (Frontend):** Angular
  * **Application Tier (Backend):** Express.js
  * **Data Tier (Database):** MySQL
  * **CI/CD & Automation:** Jenkins, Docker, Cypress
  * **Container Orchestration:** Kubernetes (Minikube), Docker Compose

## Features

  * User registration and login
  * JWT-based authentication
  * Admin panel for product management (add/remove products)
  * Shopping cart with persistent state (localStorage)
  * **Automated CI/CD pipeline** for builds, testing, and deployment.
  * **End-to-end test suite** covering critical user journeys.
  * **Containerized** with Docker and ready for **Kubernetes deployment**.
  * Automatic database table creation on startup.

-----

## CI/CD Pipeline with Jenkins

This project includes a fully automated CI/CD pipeline configured in the `Jenkinsfile`. The pipeline automatically triggers on a `git push` to the `main` branch and executes the following stages:

1.  **Checkout**: Fetches the latest source code from the Git repository.
2.  **Quality Gates**: Runs checks in parallel for both frontend and backend:
      * Installs dependencies.
      * Runs unit tests (`ng test`).
      * Performs a security audit with `npm audit`.
3.  **Build & Push Docker Images**: In parallel, the pipeline:
      * Builds new Docker images for the frontend and backend.
      * Tags the images with the unique Git commit hash for versioning.
      * Pushes the tagged images to Docker Hub.
4.  **End-to-End (E2E) Tests**:
      * Spins up the entire application stack (frontend, backend, database) in a clean environment using Docker Compose.
      * Runs a comprehensive suite of Cypress tests against the live application to simulate real user interactions.
5.  **Deploy to Minikube**:
      * Upon successful completion of all previous stages, the pipeline connects to a Kubernetes cluster.
      * It applies the Kubernetes manifest files (`.yaml`) and updates the running deployments to use the new Docker images from the build stage.

-----

## End-to-End Testing with Cypress

The project uses Cypress to perform E2E tests that validate critical user flows from start to finish.

### Tested Scenarios

  * **Homepage**: Verifies that the homepage loads successfully.
  * **Authentication**: Simulates a complete user journey of navigating to the registration page, creating a new account, and successfully logging in.
  * **Product Ordering**: Simulates a logged-in user navigating from the homepage to a category, selecting a product, adding it to the cart, and completing the entire checkout process.

### Running Tests Locally

To run the Cypress test suite on your local machine:

```bash
# Navigate to the frontend directory
cd frontend

# Run tests headlessly in the terminal
npm run e2e

# Or, to open the interactive Cypress Test Runner
npx cypress open
```

-----

## Running with Docker (Local Development)

With Docker and Docker Compose, you can run the entire application locally with a single command.

1.  **Prerequisites:**

      * [Docker](https://docs.docker.com/get-docker/) installed.
      * [Docker Compose](https://docs.docker.com/compose/install/) installed.

2.  **Run the Application:**

      * Open a terminal in the project root directory.
      * Run the command:
        ```bash
        docker-compose up -d --build
        ```
      * **Important First-Time Setup:** The database starts empty. You must go to the website and **Register** a new user account before you can log in.

3.  **Access the Application:**

      * **Website:** `http://localhost`
      * **Backend API:** `http://localhost:3000`
      * **Database:** Exposed on port `3307`.

4.  **Stopping the Application:**

    ```bash
    docker-compose down
    ```

-----

## Kubernetes Deployment (Minikube)

The application is configured for deployment to a Kubernetes cluster. These instructions are for a local cluster using Minikube.

1.  **Prerequisites:**

      * [Minikube](https://minikube.sigs.k8s.io/docs/start/) installed and running.
      * [kubectl](https://kubernetes.io/docs/tasks/tools/) installed.

2.  **Deploy the Application:**

      * Apply all the Kubernetes configuration files:
        ```bash
        kubectl apply -f mysql-deployment.yaml
        kubectl apply -f backend-deployment.yaml
        kubectl apply -f frontend-deployment.yaml
        ```
      * To update to a new image (as the pipeline does automatically):
        ```bash
        # Example for the frontend
        kubectl set image deployment/frontend-deployment frontend=saiaryansoma/e-commerce-frontend:TAG
        ```

3.  **Access the Service:**

      * Expose the frontend service to access it in your browser:
        ```bash
        minikube service frontend-service
        ```

-----

## Manual Setup Guide

### 1\. Database Setup

1.  Ensure you have MySQL installed and running on your machine.
2.  Log in to your MySQL server and create the database:
    ```sql
    CREATE DATABASE pc_parts;
    ```

### 2\. Backend Setup

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
    DB_NAME=pc_parts

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

### 3\. Frontend Setup

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

-----

## API Documentation

### Public Routes

  * `GET /api/products`: Retrieve a list of all product kits.
  * `GET /api/products/:id`: Retrieve a single product kit.

### Authentication Routes

  * `POST /api/auth/register`: Create a new user.
  * `POST /api/auth/login`: Authenticate a standard user and return a JWT.
  * `POST /api/auth/admin/login`: Authenticate the admin and return a JWT with admin privileges.

### Protected Admin Routes

*These routes require a valid admin JWT in the `Authorization` header (`Bearer <token>`).*

  * `POST /api/products`: Add a new product to the database.
  * `DELETE /api/products/:id`: Remove a product from the database.