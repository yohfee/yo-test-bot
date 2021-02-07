# yo-test-bot

## Usage
```sh
$ BOT_ID=<YOUR_BOT_ID> BOT_TOKEN=<YOUR_BOT_TOKEN> VOCAL_PITCH=220 VOCAL_VOICE=mazzo.htsvoice npm start
```

## Dockerから使う場合

`.env.example` を `.env` にコピーして、 `.env` の `BOT_ID, BOT_TOKEN` を編集する。あとは次のコマンドを実行するだけ。
```
docker-compose up
```

`index.js` を更新するスクリプトをリロードするので、Discordに再接続（ `/join` ）すること。