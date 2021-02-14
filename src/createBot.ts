import fs from 'fs';
import path from 'path';
import { Client, Message } from 'discord.js';
const OpenJTalk = require('openjtalk');

type OpenJTalk = {
  _makeWav: (text: string, pitch: number, callback: (error: Error, result: { wav: string }) => void) => void
};

type Vocal = {
  pitch: number
  voice: OpenJTalk
};

type RuleResult = string | false;

type Rule = ((message: Message) => RuleResult);

const random = (max: number) => Math.floor(Math.random() * Math.floor(max))

const randomPitch = (min = 220, range = 60) => min + random(range);

export default (token: string, rules: Rule[], voiceDir = path.join(__dirname, '..', 'voices')) => {
  const vocals: Vocal[] = fs.readdirSync(voiceDir).map(f => ({
    pitch: randomPitch(),
    voice: new OpenJTalk({
      htsvoice: path.join(voiceDir, f)
    }) as OpenJTalk,
  }));

  const members: { [key: string]: Vocal } = {};

  const client = new Client()
    .on('ready', () => console.log('I am ready!'))
    .on('message', async message => {
      console.debug(message);

      const { guild, author: { id, bot }, content, member } = message;

      console.log(`Got a message: ${content}`);

      if (!guild || bot) return;

      const channel = member?.voice.channel;
      if (channel && channel.joinable) {
        const connection = client.voice?.connections.get(channel.id) || await channel.join();

        const text = rules.reduce((c: RuleResult, f) => c ? c : f(message), false);
        if (text) {
          members[id] ||= vocals[random(vocals.length)];
          const { voice, pitch } = members[id];

          voice._makeWav(text, pitch, (error: Error, result) => {
            if (error) {
              return console.error(error);
            }

            const file = path.join(__dirname, result.wav);
            console.log(`Start playing: ${file}`);

            const dispatcher = connection.play(file);
            dispatcher.on('finish', () => fs.unlinkSync(file));
          });
        }
      }
    });

  return {
    run: () => client.login(token),
  };
}
