import fs from 'fs';
import path from 'path';
import { create } from './bot';

const token = process.env.BOT_TOKEN;
if (!token) {
  console.log('Environment variable BOT_TOKEN is missing.');
  process.exit(1);
}

import createPlaySkill from './skills/play';
const play = (() => {
  const soundDir = path.join(__dirname, '..', 'sounds');
  const sounds = fs.readdirSync(soundDir).map(f => path.join(soundDir, f));

  return createPlaySkill(sounds);
})();

import createSaySkill from './skills/say';
import SimpleRules from '../rules.json';
import FavoritePhrases from '../favorite-phrases.json';
import BukiList from '../buki-list.json';
const say = (() => {
  const simpleRules: { [key: string]: string } = SimpleRules;
  const favoritePhrase: { [username: string]: string[] } = FavoritePhrases;
  const bukiList: string[] = BukiList;

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
    ({ content }) => content === '/buki' && `オレは ${randomChoice(bukiList)}でいく`,
    ({ content, author: { username } }) => [simpleRules[content] || content, myPhrase(username)].join('')
  ]);
})();

const bot = create(token, [play, say]);

(async () => {
  try {
    await bot.run();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
