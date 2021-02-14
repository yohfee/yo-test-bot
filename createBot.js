const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');
const OpenJTalk = require('openjtalk');

const random = max => Math.floor(Math.random() * Math.floor(max))

module.exports = (token, rules) => {
  const vocals = fs.readdirSync(path.join(__dirname, 'voices')).map(f => ({
    pitch: 220 + random(60),
    voice: new OpenJTalk({
      htsvoice: path.join(__dirname, 'voices', f)
    }),
  }));

  const members = {};

  const client = new Discord.Client()
    .on('ready', () => console.log('I am ready!'))
    .on('message', async message => {
      console.debug(message);

      const { guild, author: { id, bot }, content, member } = message;

      console.log(`Got a message: ${content}`);

      if (!guild || bot) return;

      const channel = member?.voice?.channel;
      if (channel && channel.joinable) {
        const connection = client.voice.connections[channel.id] || await channel.join();

        const text = rules.reduce((c, f) => c ? c : f(message), null);
        if (text) {
          members[id] ||= vocals[random(vocals.length)];
          const { voice, pitch } = members[id];

          voice._makeWav(text, pitch, (error, result) => {
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
