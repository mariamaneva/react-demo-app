pipeline {
    agent any

    stages {
        stage('without docker') {
            steps {
                sh '''
                    echo "without docker"
                    ls -la
                    touch container-no.txt
                '''
            }
        }

        stage('with docker') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true // use the same workspace
                }
              
            }
            steps {
                sh '''
                    echo "with docker"
                    npm --version
                    touch container-yes.txt
                '''
            }
        }
    }
}
