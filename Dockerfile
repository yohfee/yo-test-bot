FROM node:15.8.0-buster

ENV BOT_TOKEN $BOT_TOKEN
ENV VOCAL_PITCH 250
ENV VOCAL_VOICE mei_happy.htsvoice

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

CMD [ "npm", "start" ]