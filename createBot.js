const path = require('path');
const Discord = require('discord.js');
const OpenJTalk = require('openjtalk');

module.exports = function (botId, botToken, voices, defaultVoice, defaultPitch) {
  const client = new Discord.Client();

  const vocals = voices.reduce((vocals, voice) => {
    vocals[path.parse(voice).name] = new OpenJTalk({
      htsvoice: voice,
    });
    return vocals;
  }, {});

  let connection = null;
  const commands = [];

  const addCommand = ({ matcher, command }) => {
    commands.push({ matcher, command });
  };

  const addPattern = (pattern, command) => {
    addCommand({ matcher: ({ content }) => content === pattern, command });
  }

  const addSpeak = (pattern, content, voice, pitch) => {
    addPattern(pattern, async () => await bot.speak(content, voice, pitch));
  }

  const reply = async (message, content) => {
    await message.reply(content);
  }

  const join = async message => {
    const channel = message.member?.voice?.channel;
    if (channel) {
      connection = await channel.join();
    }
  }

  const speak = (content, voice, pitch) => new Promise((resolve, reject) => {
    (vocals[voice || defaultVoice])._makeWav(content, pitch || defaultPitch, (error, result) => {
      if (error) {
        return reject(error);
      }

      const file = path.join(__dirname, result.wav);
      const dispatcher = connection.play(file);

      // TODO
      dispatcher.on('debug', console.debug);
      dispatcher.on('error', console.error);
      resolve();
    });
  });

  const execute = async message => {
    const command = commands.find(({ matcher }) => matcher(message))?.command;
    if (command) {
      await command(message);
    }
  }

  const start = async () => {
    client.on('ready', () => console.log('Ready'));

    client.on('message', async message => {
      console.log('Message: ', message.content);

      if (message.guild && message.author.id !== botId) {
        await execute(message);
      }
    });

    await client.login(botToken);
  };

  return {
    addCommand,
    addPattern,
    addSpeak,
    reply,
    join,
    speak,
    start,
  };
}
