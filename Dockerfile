FROM node:15.8.0-buster

WORKDIR /app

RUN npm install ffmpeg-static --save

COPY ./package.json /app
RUN npm install

CMD [ "npm", "start" ]