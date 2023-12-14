FROM node:18 AS builder

COPY package.json .
COPY package-lock.json .
RUN npm config set registry https://registry.npmmirror.com && npm i

COPY . .

FROM node:18

WORKDIR /opt/app

COPY --from=builder ./node_modules ./node_modules
COPY --from=builder ./app ./app
COPY --from=builder ./config ./config
COPY --from=builder ./config ./config
COPY --from=builder ./package.json ./package.json

EXPOSE 7001

ENV EGG_SERVER_ENV=prod

CMD [ "npm", "start" ]