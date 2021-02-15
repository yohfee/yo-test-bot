import { Client, Message } from 'discord.js';
import { Say, create as createSay } from './say';

import Rules from '../rules.json';
const rules : { [key: string]: string } = Rules;

const random = (max: number) => Math.floor(Math.random() * Math.floor(max))

const randomVocal = (voices: string[], minPitch: number, pitchRange: number): Say =>
  createSay(voices[random(voices.length)], minPitch + random(pitchRange));

export const create = (token: string, voices: string[], minPitch: number, pitchRange: number) => {
  const members: { [id: string]: Say } = {};

  const client = new Client().on('message', async message => {
    console.debug(message);

    const { guild, author: { id, bot, username }, content, member } = message;

    if (!guild || bot) return;

    console.log(`${username} inputs "${content}"`);

    const channel = member?.voice.channel;
    if (channel && channel.joinable) {
      const connection = client.voice?.connections.get(channel.id) || await channel.join();

      const text = rules.hasOwnProperty(content) ? rules[content] : content;
      if (text) {
        console.log(`${username} says "${text}"`);

        members[id] ||= randomVocal(voices, minPitch, pitchRange);

        try {
          const { file, dispose } = await members[id](text);
          const dispatcher = connection.play(file);
          dispatcher.on('finish', dispose);
        } catch (error) {
          console.error(error);
        }
      }
    }
  });

  return {
    run: async () => await client.login(token),
  };
}
