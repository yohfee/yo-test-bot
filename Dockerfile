FROM node:15.8.0-buster

ENV BOT_TOKEN $BOT_TOKEN

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

CMD [ "yarn", "start" ]