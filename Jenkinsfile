pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Backend Dependencies') {
            steps {
                dir('backend') {
                    bat 'npm install'
                }
            }
        }
        stage('Frontend Dependencies') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                }
            }
        }
        stage('Frontend Tests') {
            steps {
                dir('frontend') {
                    sh 'npm test -- --no-watch --browsers=ChromeHeadless' // Run tests in headless mode
                }
            }
        }
        stage('Backend Tests (Placeholder)') {
            steps {
                dir('backend') {
                    echo 'No backend tests configured yet. Add your test command here (e.g., npm test).'
                    // sh 'npm test' // Uncomment and configure when backend tests are ready
                }
            }
        }
        stage('Frontend Build') {
            steps {
                dir('frontend') {
                    bat 'npm run build -- --configuration=production' // Build for production
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
