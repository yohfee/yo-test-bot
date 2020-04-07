const path = require("path");
const Discord = require("discord.js");
const OpenJTalk = require("openjtalk");
const client = new Discord.Client();
const mazzo = new OpenJTalk({
  htsvoice: path.join(__dirname, "mazzo.htsvoice")
});

let _connection;

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", message => {
  if (message.content === "ping") {
    return message.reply("pong");
  }

  if (!message.guild) return;

  if (message.content === "/join") {
    if (message.member.voiceChannel) {
      message.member.voiceChannel
        .join()
        .then(connection => {
          message.reply("I have successfully connected to the channel!");
          _connection = connection;
        })
        .catch(console.log);
    } else {
      message.reply("You need to join a voice channel first!");
    }

    return;
  }

  if (_connection && message.content.startsWith("/mazzo ")) {
    mazzo._makeWav(
      message.content.replace(/^\/mazzo /, ""),
      220,
      (error, result) => {
        if (error) {
          return console.log(error);
        }
        const dispatcher = _connection.playFile(
          path.join(__dirname, result.wav),
          () => {
            dispatcher.end();
          }
        );
        dispatcher.on("end", () => {
          console.log("end: " + result.wav);
        });
        dispatcher.on("error", e => {
          console.log("error: " + result.wav);
          console.log(e);
        });
      }
    );
  }
});

client.login(process.env.TOKEN);
