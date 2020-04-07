const Discord = require("discord.js");
const OpenJTalk = require("openjtalk");
const client = new Discord.Client();
const mei = new OpenJTalk();

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", message => {
  if (message.content === "ping") {
    message.reply("pong");
  } else {
    if (!message.guild) return;

    if (message.content === "/join") {
      if (message.member.voiceChannel) {
        message.member.voiceChannel
          .join()
          .then(connection => {
            message.reply("I have successfully connected to the channel!");
            mei._makeWav(message.content, 220, (error, result) => {
              if (error) {
                return console.log(error);
              }
              const dispatcher = connection.playFile(result.wav);
              dispatcher.on("end", () => {
                console.log("end: " + result.wav);
              });
              dispatcher.on("error", e => {
                console.log("error: " + result.wav);
                console.log(e);
              });
              dispatcher.setVolume(1);
              console.log(dispatcher.time);
              dispatcher.pause();
              dispatcher.resume();
              dispatcher.end();
            });
          })
          .catch(console.log);
      } else {
        message.reply("You need to join a voice channel first!");
      }
    }
  }
});

client.login(process.env.TOKEN);
