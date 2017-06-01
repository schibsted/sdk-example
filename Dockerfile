FROM node:6.10.3-alpine

WORKDIR /usr/src/app

COPY package.json .
RUN ["npm", "install", "--production"]

# Keep these in one line to avoid creating unnecessary layers
COPY views/ views/
COPY config.js app.js server.js ./

# Pass these two variables when running the image.
# See https://docs.docker.com/engine/reference/run/#env-environment-variables
ENV CLIENT_ID="UNDEFINED" CLIENT_SECRET="UNDEFINED"

EXPOSE 9000

CMD ["node", "server"]
