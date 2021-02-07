FROM node:15.8.0-buster

WORKDIR /app

COPY . /app

RUN npm install ffmpeg-static --save && \
    npm install

CMD [ "npm", "start" ]