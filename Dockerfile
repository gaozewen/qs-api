FROM node:18 AS builder

WORKDIR /opt/app

COPY package.json .
COPY package-lock.json .
RUN npm config set registry https://registry.npmmirror.com && npm i -g pnpm

COPY . .

EXPOSE 7001

ENV EGG_SERVER_ENV=prod

CMD [ "npm", "start" ]