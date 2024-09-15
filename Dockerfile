FROM node:10.16.3-alpine
WORKDIR /app
ADD . /app
# Python for netlify
# RUN apk add g++ make py3-pip
RUN npm install
EXPOSE 3000
# CMD npm run buildAndStart
CMD npm run buildAndServe
