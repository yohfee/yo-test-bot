const path = require("path");
const Discord = require("discord.js");
const OpenJTalk = require("openjtalk");

const {
  BOT_ID,
  BOT_TOKEN,
  VOCAL_VOICE,
  VOCAL_PITCH,
} = process.env;

const rules = [
  ({ content }) => content === '/neko' && 'にゃーん',
  ({ content }) => content
];

const client = new Discord.Client();
const vocal = new OpenJTalk({
  htsvoice: path.join(__dirname, 'voices', VOCAL_VOICE)
});

let _connection;

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", async message => {
  console.log(`Got a message: ${message.content}`);

  if (message.content === "ping") {
    return message.reply("pong");
  }

  if (!message.guild) return;

  if (message.content === "/join") {
    if (message.member?.voice?.channel) {
      try {
        _connection = await message.member.voice.channel.join();
        message.reply('I have successfully connected to the channel!');
      } catch (e) {
        console.error(e);
        message.reply('I could not connect to the channel...');
      }
    } else {
      message.reply('You need to join a voice channel first!');
    }

    return;
  }

  if (_connection) {
    if (message.author.id === BOT_ID) {
      return;
    }

    const content = rules.reduce((c, f) => c ? c : f(message), null);
    if (content) {
      vocal._makeWav(content, VOCAL_PITCH, (error, result) => {
        if (error) {
          return console.error(error);
        }

        const file = path.join(__dirname, result.wav);
        console.log(`Start playing: ${file}`);

        const dispatcher = _connection.play(file);
        dispatcher.on('debug', console.debug);
        dispatcher.on('error', console.error);
      });
    }
  } else {
    console.log('There is no connection...');
  }
});

client.login(BOT_TOKEN);
