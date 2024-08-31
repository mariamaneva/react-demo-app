pipeline {
    agent any

    stages {
        // This is a simple comment
        /* this is a block comment */
        stage('Build without docker') {
            agent {
                docker {
                    image 'node:10.16.3-alpine'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    # this is a shell script comment
                    ls -la
                    node --version
                    npm --version
                    npm ci
                    npm run build:prod:ci
                '''
            }
        }
        stage('Test without docker') {
            agent {
                docker {
                    image 'node:10.16.3-alpine'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    test -f dist/index.html
                    npm run coverage
                '''
            }
        }
        stage('E2E2 without docker') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.46.1-jammy'
                    reuseNode true
                }
            }
            steps {
                sh '''
                  npm run start:ci & 
                  # wait for the server to start
                  sleep 10
                  npx playwright test
                '''
            }
        }
    }
    post {
        always {
            // different from the original example
            // publishHTML(target: [
            //     reportName: 'Clover Coverage Report',
            //     reportDir: 'coverage',
            //     reportFiles: 'clover.xml',
            //     keepAll: true,
            //     alwaysLinkToLastBuild: true,
            //     allowMissing: false
            // ])

            // test with cobertura (enable plugins: 'cobertura')
            // cobertura coberturaReportFile: 'coverage/clover.xml'
            junit 'coverage/clover.xml'
            junit 'playwright-report/index.html'
        }
    }
}
