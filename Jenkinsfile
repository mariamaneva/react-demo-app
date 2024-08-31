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
   

        stage('Run tests without docker') {
            parallel {
                stage('Unit tests') {
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
                     post {
                        always {
                            // different from the original example
                            // note: doesnt render due to sandboxing limitations
                            // can be disabled in the Jenkins console
                            // publishHTML(target: [
                            //     reportName: 'Clover Coverage Report',
                            //     reportDir: 'coverage',
                            //     reportFiles: 'clover.xml',
                            //     keepAll: true,
                            //     alwaysLinkToLastBuild: true,
                            //     allowMissing: false
                            // ])

                            // publish unit test report with cobertura (enable plugins: 'cobertura')
                            cobertura coberturaReportFile: 'coverage/cobertura-coverage.xml'
                        }
                    }
                }
                stage('E2E2 tests') {
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
                    always {                            
                        // publish e2e test results with junit
                        // junit 'playwright-report/results.xml'

                        // publish e2e test results with publishHTML
                        publishHTML(target: [
                            reportName: 'Playwright E2E Report',
                            reportDir: 'playwright-report',
                            reportFiles: 'index.html',
                            keepAll: true,
                            alwaysLinkToLastBuild: true,
                            allowMissing: false
                        ])
                    }
                }
            }
        }
    }
   
}
