FROM mcr.microsoft.com/playwright:v1.46.1-jammy
# WORKDIR /app
# ADD . /app

RUN npm -g install netlify-cli
RUN apt update
RUN apt install -y jq
# EXPOSE 3000
