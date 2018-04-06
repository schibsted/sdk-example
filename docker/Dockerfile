FROM node:8.10-alpine

ENV NPM_CONFIG_LOGLEVEL warn

WORKDIR /usr/src/app

COPY . ./

RUN npm install && npm run build

CMD ["node", "server"]
