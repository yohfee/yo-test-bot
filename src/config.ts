import fs from "fs";
import path from "path";
import { Config as SayConfig } from "./commands/say"
import { Config as StableDiffusionConfig } from "./commands/stableDiffusion"

type Config = {
  token?: string;
  say: SayConfig;
  stableDiffusion: StableDiffusionConfig;
};

const simpleRules: { [key: string]: string } = require("../rules.json");
const favoritePhrase: { [username: string]: string[] } = require("../favorite-phrases.json");
const bukiList: string[] = require("../buki-list.json");

const randomChoice = (array: string[]) => array[Math.floor(Math.random() * array.length)];
const myPhrase = (name: string) => {
  if (favoritePhrase[name] === undefined) {
    favoritePhrase[name] = [randomChoice(favoritePhrase["_default_"])];
  }
  return randomChoice(favoritePhrase[name]);
}

const voiceDir = path.join(__dirname, "..", "voices");

const config: Config = {
  token: process.env.BOT_TOKEN,
  say: {
    voices: fs.readdirSync(voiceDir).map(f => path.join(voiceDir, f)),
    minPitch: 220,
    pitchRange: 60,
    rules: [
      ({ content, author: { username } }) => username === "まさほふ" && content === "/unk" && "最強のうんこちんちん",
      ({ content }) => content === "/buki" && `オレは ${randomChoice(bukiList)}でいく`,
      ({ content, author: { username } }) => [simpleRules[content] || content, myPhrase(username)].join(""),
    ],
  },
  stableDiffusion: {
    host: process.env.SD_HOST,
    match: ({ content }) => content.match(/^(.+)画像はこちら。?$/)?.[1],
  },
};

export default config;
