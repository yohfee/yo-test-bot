import fs from 'fs';
import path from 'path';
import {create} from './bot';

import SimpleRules from '../rules.json';
const simpleRules: { [key: string]: string } = SimpleRules;

import FavoritePhrases from '../favorite-phrases.json';
const favoritePhrase: { [username: string]: string[] } = FavoritePhrases;

const randomChoice = (array: string[]) => array[Math.floor(Math.random() * array.length)];
const myPhrase = (name:string) => {
  if (favoritePhrase[name] === undefined) {
    favoritePhrase[name] = [randomChoice(favoritePhrase['_default_'])];
  }
  return randomChoice(favoritePhrase[name]);
}

const token = process.env.BOT_TOKEN;
if (!token) {
  console.log('Environment variable BOT_TOKEN is missing.');
  process.exit(1);
}

const voiceDir = path.join(__dirname, '..', 'voices');
const voices = fs.readdirSync(voiceDir).map(f => path.join(voiceDir, f));
const minPitch = 220;
const pitchRange = 60;

const bot = create(token, voices, minPitch, pitchRange, [
  ({content, author: {username}}) => username === 'まさほふ' && content === '/unk' && '最強のうんこちんちん',
  ({content, author: {username}}) => [simpleRules[content] || content, myPhrase(username)].filter(s => s).join(''),
  ({content}) => content
]);

(async () => {
  try {
    await bot.run();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
