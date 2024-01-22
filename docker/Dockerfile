FROM node:18.19.0-alpine

ENV NPM_CONFIG_LOGLEVEL warn

WORKDIR /usr/src/app

COPY . ./

RUN npm ci && npm run build

CMD ["npm", "start"]
