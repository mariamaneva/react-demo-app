pipeline {
    agent any

    stages {
        stage('Build without docker') {
            agent {
                docker {
                    image 'node:10.16.3-alpine'
                    reuseNode true
                }
            }
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
            cobertura coberturaReportFile: 'coverage/clover.xml'
        }
    }
}
