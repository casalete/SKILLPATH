FROM node:14 as base

WORKDIR /usr/local/app/backend

COPY package*.json /usr/local/app/backend

RUN npm install

COPY . /usr/local/app/backend

ENV NODE_PATH=./dist

RUN npm run build

EXPOSE 3000

ENTRYPOINT [ "npm","start"] 



