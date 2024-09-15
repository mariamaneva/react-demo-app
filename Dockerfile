FROM mcr.microsoft.com/playwright:v1.46.1-jammy

RUN npm -g install netlify-cli
# Running in a separate command will cache the result
# RUN apt update 
RUN apt update && apt install -y jq
