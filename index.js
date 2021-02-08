const fs = require('fs');
const path = require('path');
const createBot = require('./createBot');

const {
  BOT_ID,
  BOT_TOKEN,
} = process.env;

const bot = createBot(BOT_ID, BOT_TOKEN, fs.readdirSync(path.join(__dirname, 'voices')), 'mei_happy', 250);

bot.addPattern('/join', bot.join);
bot.addPattern('/ping', async message => await bot.reply(message, 'pong'));

bot.addSpeak('/unk', 'うんこちんちん');
bot.addSpeak('/yunk', 'うんこちんちん', 'mazzo', 300);
bot.addSpeak('/neko', 'にゃーん');
bot.addSpeak('/ng', 'ナイスガンジー');
bot.addSpeak('/mmm', 'まんめんみ');
bot.addSpeak('/oo', 'おっぱいおっぱい');
bot.addSpeak('/c', 'カムイン');
bot.addSpeak('/sv', 'サービスサービス');
bot.addSpeak('/moon', 'つきにかわっておしおきよ');
bot.addSpeak('/ops', 'おっぱいのぺらぺらソース');
bot.addSpeak('/uns', 'うんこだ、捨てろ');
bot.addSpeak('/sm', 'ごめんね素直じゃなくて');
bot.addSpeak('/bye', 'じゃあの');

bot.addCommand({
  matcher: () => true,
  command: async ({ content }) => bot.speak(content),
});

bot.start().catch(console.error);