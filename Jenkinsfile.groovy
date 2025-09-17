pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Quality Gates') {
            parallel {
                stage('Frontend') {
                    agent any
                    steps {
                        dir('frontend') {
                            echo '--- Installing Frontend Dependencies ---'
                            bat 'npm install'
                            echo '--- Linting Frontend ---'
                            // To enable, configure a linter (e.g., ng add @angular-eslint/schematics) and uncomment the line below.
                            // The 'lint' script is missing in frontend/package.json.
                            // bat 'npm run lint' // This line was causing the error. Ensure it is commented out.
                            echo '--- Running Frontend Tests ---'
                            bat 'npm test -- --no-watch --browsers=ChromeHeadless'
                            echo '--- Auditing Frontend Dependencies for Security ---'
                            // Fails the build if high or critical severity vulnerabilities are found
                            bat 'npm audit --audit-level=high'
                        }
                    }
                }
                stage('Backend') {
                    agent any
                    steps {
                        dir('backend') {
                            echo '--- Installing Backend Dependencies ---'
                            bat 'npm install'
                            echo '--- Linting Backend ---'
                            echo 'Skipping backend linting. To enable, add a "lint" script to backend/package.json and uncomment the line below.'
                            // bat 'npm run lint'
                            
                            echo '--- Running Backend Tests ---'
                            echo 'Skipping backend tests. To enable, configure your tests and use the command below.'
                            // bat 'npm test'

                            echo '--- Auditing Backend Dependencies for Security ---'
                            // Fails the build if high or critical severity vulnerabilities are found
                            bat 'npm audit --audit-level=high'
                        }
                    }
                }
            }
        }
        stage('Build & Push Docker Images') {
            parallel {
                stage('Frontend Image') {
                    agent any
                    steps {
                        dir('frontend') {
                            script {
                                echo '--- Building and Pushing Frontend Docker Image ---'
                                def gitCommit = bat(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
                                // Replace 'saiaryans' with your Docker Hub username
                                def imageName = "saiaryans/e-commerce-frontend:${gitCommit}"
                                
                                bat "docker build -t ${imageName} -f Dockerfile ."
                                withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                                    bat "echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin"
                                    bat "docker push ${imageName}"
                                }
                            }
                        }
                    }
                }
                stage('Backend Image') {
                    agent any
                    steps {
                        dir('backend') {
                            script {
                                echo '--- Building and Pushing Backend Docker Image ---'
                                def gitCommit = bat(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
                                // Replace 'saiaryans' with your Docker Hub username
                                def imageName = "saiaryans/e-commerce-backend:${gitCommit}"

                                bat "docker build -t ${imageName} -f Dockerfile ."
                                withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                                    bat "echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin"
                                    bat "docker push ${imageName}"
                                }
                            }
                        }
                    }
                }
            }
        }
        stage('E2E Tests') {
            agent any
            steps {
                script {
                    // A try-finally block is crucial to ensure the environment is always torn down, even if tests fail.
                    try {
                        echo '--- Starting application stack with Docker Compose ---'
                        // The '-d' runs it in detached mode. '--build' ensures fresh images are used.
                        bat 'docker-compose up -d --build'

                        echo '--- Waiting for services to become healthy ---'
                        // Poll the frontend service until it returns a successful status code.
                        // The --retry options make this a robust way to wait, replacing a brittle 'sleep'.
                        bat 'curl --retry 20 --retry-delay 5 --retry-connrefused -f http://localhost'

                        echo '--- Running Cypress E2E Tests ---'
                        // Run the Cypress tests headlessly from the frontend directory.
                        dir('frontend') {
                            bat 'npm run e2e'
                        }
                    } finally {
                        echo '--- Tearing down application stack ---'
                        bat 'docker-compose down'
                    }
                }
            }
        }
    }
    post {
        always {
            cleanWs() // Clean up workspace after build
        }
        failure {
            echo 'Pipeline failed!'
        }
        success {
            echo 'Pipeline succeeded!'
        }
    }
}
