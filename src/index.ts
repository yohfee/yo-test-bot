import fs from 'fs';
import path from 'path';
import { create } from './bot';

const token = process.env.BOT_TOKEN;
if (!token) {
  console.log('Environment variable BOT_TOKEN is missing.');
  process.exit(1);
}

import createSaySkill from './skills/say';
import SimpleRules from '../rules.json';
import FavoritePhrases from '../favorite-phrases.json';
const say = (() => {
  const simpleRules: { [key: string]: string } = SimpleRules;
  const favoritePhrase: { [username: string]: string[] } = FavoritePhrases;

  const randomChoice = (array: string[]) => array[Math.floor(Math.random() * array.length)];
  const myPhrase = (name: string) => {
    if (favoritePhrase[name] === undefined) {
      favoritePhrase[name] = [randomChoice(favoritePhrase['_default_'])];
    }
    return randomChoice(favoritePhrase[name]);
  }

  const voiceDir = path.join(__dirname, '..', 'voices');
  const voices = fs.readdirSync(voiceDir).map(f => path.join(voiceDir, f));
  const minPitch = 220;
  const pitchRange = 60;

  return createSaySkill(voices, minPitch, pitchRange, [
    ({ content, author: { username } }) => username === 'まさほふ' && content === '/unk' && '最強のうんこちんちん',
    ({ content, author: { username } }) => [simpleRules[content] || content, myPhrase(username)].join('')
  ]);
})();

const bot = create(token, [say]);

(async () => {
  try {
    await bot.run();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
