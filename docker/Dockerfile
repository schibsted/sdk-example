FROM node:14.15-alpine

ENV NPM_CONFIG_LOGLEVEL warn

WORKDIR /usr/src/app

COPY . ./

RUN npm install && npm run build

CMD ["node", "server"]
