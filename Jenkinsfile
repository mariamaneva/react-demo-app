pipeline {
    agent any

    stages {
        agent {
            docker {
                image 'node:10.16.3-alpine'
                reuseNode true
            }
        }
        stage('Build without docker') {
            steps {
                sh '''
                    ls -la
                    node --version
                    npm --version
                    npm ci
                    npm run build:prod
                '''
            }
        }
        stage('Test without docker') {
            steps {
                sh '''
                    test -f dist/index.html
                    npm test
                '''
            }
        }
    }
}
