import { Message } from 'discord.js';
import { Skill } from '../bot';
import { Say, create } from '../say';

type RuleResult = string | false;

export type Rule = (message: Message) => RuleResult;

const random = (max: number) => Math.floor(Math.random() * Math.floor(max))

const randomVocal = (voices: string[], minPitch: number, pitchRange: number): Say =>
  create(voices[random(voices.length)], minPitch + random(pitchRange));

export default (voices: string[], minPitch: number, pitchRange: number, rules: Rule[]): Skill => {
  const members: { [id: string]: Say } = {};

  return async (connection, message) => {
    const { author: { id, username } } = message;

    const text = rules.reduce((result, rule) => result ? result : rule(message), false as RuleResult);

    if (text) {
      console.log(`${username} says "${text}"`);

      members[id] ||= randomVocal(voices, minPitch, pitchRange);

      try {
        const { file, dispose } = await members[id](text);
        const dispatcher = connection.play(file);

        return await new Promise(resolve => {
          dispatcher.on('finish', () => {
            dispatcher.destroy();
            dispose();
            resolve(true);
          });
        });
      } catch (error) {
        console.error(error);
      }
    }

    return false;
  }
}
