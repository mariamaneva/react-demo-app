pipeline {
    agent any

    environment {
        NETLIFY_AUTH_TOKEN = credentials('netlify-token')
        REACT_APP_VERSION = "1.0.$BUILD_ID"
    }

    stages {
        stage("AWS") {
            agent {
                docker {
                    image 'amazon/aws-cli:2.15.53'
                    args "--entrypoint=''"
                }
            }

            steps {
                sh '''
                    aws --version
                '''
            }
        }

        // This is a simple comment
        /* this is a block comment */
        stage('Build') {
            agent {
                docker {
                    image 'my-playwright'
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
                            image 'my-playwright'
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
                stage('Local E2E2 tests') {
                    agent {
                        docker {
                            image 'my-playwright'
                            args '-u root:root'
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
                    image 'my-playwright'
                    args '-u root:root'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    echo deploying to staging. Site ID: $NETLIFY_SITE_ID
                    netlify status
                    netlify deploy --dir=dist --json > deploy-output.json
                '''
                script {
                    env.STAGING_URL = sh(script: "jq -r  '.deploy_url' deploy-output.json", returnStdout: true)
                }
            }

        }

        stage('Staging E2E2') {
            agent {
                docker {
                    image 'my-playwright'
                    args '-u root:root'
                    reuseNode true
                }
            }
            
            environment {
                CI_ENVIRONMENT_URL = "${env.STAGING_URL}"
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

        //  stage('Approval') {
        //     steps {
        //         timeout(time: 5, unit: 'MINUTES') {
        //             input message: 'Ready to deploy?', ok: 'Yes, I want to deploy'
        //         }
        //     }
        // }

        stage('Deploy prod + E2E2') {
            agent {
                docker {
                    image 'my-playwright'
                    args '-u root:root'
                    reuseNode true
                }
            }
            
            environment {
                CI_ENVIRONMENT_URL = "https://my-demo-app-manual-deploy.netlify.app"
            }

            steps {
                sh '''
                    netlify --version
                    echo deploying to production. Site ID: $NETLIFY_SITE_ID
                    netlify status
                    netlify deploy --dir=dist --prod
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
