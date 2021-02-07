FROM node:15.8.0-buster

WORKDIR /app

RUN npm install ffmpeg-static --save
RUN npm install nodemon -g

COPY ./package.json /app
RUN npm install

CMD [ "npm", "start" ]