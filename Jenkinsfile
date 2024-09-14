pipeline {
    agent any

    environment {
        NETLIFY_AUTH_TOKEN = credentials('netlify-token')
    }

    stages {
        // This is a simple comment
        /* this is a block comment */
        stage('Build without docker') {
            agent {
                docker {
                    image 'node:22.7.0-alpine'
                    args '-u root:root'
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
                    npm run build:prod
                '''
            }
        }

        stage('Run tests without docker') {
            parallel {
                stage('Unit tests') {
                    agent {
                        docker {
                            image 'node:22.7.0-alpine'
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
                        npm run start & 
                        # wait for the server to start
                        sleep 10
                        npx playwright test
                        '''
                    }
                    post {
                        always {                            
                            // publish e2e test results with junit
                            // junit 'playwright-report/results.xml'

                            // publish e2e test results with publishHTML
                            publishHTML(target: [
                                reportName: 'Playwright Local E2E',
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

        stage('Deploy Staging') {
            agent {
                docker {
                    image 'node:22.7.0-alpine'
                    args '-u root:root'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    npm install netlify-cli
                    npm install node-jq
                    node_modules/.bin/netlify --version
                    echo deploying to staging. Site ID: $NETLIFY_SITE_ID
                    node_modules/.bin/netlify status
                    node_modules/.bin/netlify deploy --dir=dist --json > deploy-output.json
                '''
            }
            script {
                env.STAGING_URL = sh(script: "node_modules/.bin/node-jq -r '.deploy_url' deploy-output.json", returnStdout: true)
            }
        }

         stage('Staging E2E2') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.46.1-jammy'
                    reuseNode true
                }
            }
            
            environment {
                CI_ENVIRONMENT_URL = "${eng.STAGING_URL}"
            }

            steps {
                sh '''
                    npx playwright test
                '''
            }
            post {
                always {                            
                    // publish e2e test results with junit
                    // junit 'playwright-report/results.xml'

                    // publish e2e test results with publishHTML
                    publishHTML(target: [
                        reportName: 'Playwright Stage E2E',
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        keepAll: true,
                        alwaysLinkToLastBuild: true,
                        allowMissing: false
                    ])
                }
            }
        }

         stage('Approval') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    input message: 'Ready to deploy?', ok: 'Yes, I want to deploy'
                }
            }
        }

        stage('Deploy Porduction') {
            agent {
                docker {
                    image 'node:22.7.0-alpine'
                    args '-u root:root'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    npm install netlify-cli
                    node_modules/.bin/netlify --version
                    echo deploying to production. Site ID: $NETLIFY_SITE_ID
                    node_modules/.bin/netlify status
                    node_modules/.bin/netlify deploy --dir=dist --prod
                '''
            }
        }

        stage('Prod E2E2') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.46.1-jammy'
                    reuseNode true
                }
            }
            
            environment {
                CI_ENVIRONMENT_URL = "https://my-demo-app-manual-deploy.netlify.app"
            }

            steps {
                sh '''
                    npx playwright test
                '''
            }
            post {
                always {                            
                    // publish e2e test results with junit
                    // junit 'playwright-report/results.xml'

                    // publish e2e test results with publishHTML
                    publishHTML(target: [
                        reportName: 'Playwright Prod E2E',
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
