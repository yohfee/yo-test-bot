import fs from 'fs';
import path from 'path';
import { create } from './bot';

import SimpleRules from '../rules.json';
const simpleRules : { [key: string]: string } = SimpleRules;

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
  ({ content, author: { username } }) => username === 'まさほふ' && content === '/unk' && '最強のうんこちんちん',
  ({ content }) => content === '/yom' && 'おれはおれのせきむをまっとうする', // こっちに書いたルールが優先
  ({ content }) => simpleRules.hasOwnProperty(content) && simpleRules[content],
  ({ content }) => content

]);

(async () => {
  try {
    await bot.run();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
