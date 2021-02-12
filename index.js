const path = require("path");
const Discord = require("discord.js");
const OpenJTalk = require("openjtalk");

const {
  BOT_TOKEN,
  VOCAL_VOICE,
  VOCAL_PITCH,
} = process.env;

const rules = [
  ({ content }) => content === '/unk' && 'うんこちんちん',
  ({ content }) => content === '/neko' && 'にゃーん',
  ({ content }) => content === '/ng' && 'ナイスガンジー',
  ({ content }) => content === '/mmm' && 'まんめんみ',
  ({ content }) => content === '/oo' && 'おはようおっぱい',
  ({ content }) => content === '/c' && 'カムイン',
  ({ content }) => content === '/sv' && 'サービスサービス',
  ({ content }) => content === '/moon' && 'つきにかわっておしおきよ',
  ({ content }) => content === '/ops' && 'おっぱいのぺらぺらソース',
  ({ content }) => content === '/uns' && 'うんこだ、捨てろ',
  ({ content }) => content === '/sm' && 'ごめんね素直じゃなくて、夢の中なら言える',
  ({ content }) => content === '/smm' && '思考回路はショート寸前、いますぐあいたいの',
  ({ content }) => content === '/bye' && 'じゃあの',
  ({ content }) => content === '/yom' && 'よもや、よもやだ',
  ({ content }) => content === '/inu' && 'いぬぬわん',
  ({ content }) => content === '/kon' && 'こんみかみん',
  ({ content }) => content === '/hime' && 'まーーーーーーっ',
  ({ content }) => content === '/ore' && 'オレはガンダムでいく',
  ({ content }) => content === '/tan' && 'がんばれ、がんばれ、たんじろう',
  ({ content }) => content === '/zen' && 'カミナリの呼吸、壱の型',
  ({ content }) => content === '/gw' && 'アスファルト、タイヤを切りつけながら、暗闇走り抜ける',
  ({ content }) => content === '/gww' && 'チープなスリルに、身を任せても、明日におびえていたよ',
  ({ content }) => content === '/gwww' && 'ゲッワイ、エン、タフ',
  ({ content }) => content === '/ss' && 'セイントせいやーーーゃーーーゃーーーーっ',
  ({ content }) => content === '/n' && 'ナイスっ',
  ({ content }) => content === '/unix' && 'ユニックスならわかるわっ',
  ({ content }) => content === '/bio' && 'かゆ、うま',
  ({ content }) => content === '/tom' && 'ウェルカムツゥジ、クレイジータイム、このふざけた世界にようこそっ',
  ({ content }) => content === '/zz' && 'アニメじゃないっアニメじゃない、ホントのこーーとさーーーっ',
  ({ content }) => content === '/un' && 'アーンインストーール、アーーンインストーーーールっ',
  ({ content }) => content === '/iyan' && 'まいっちんぐ',
  ({ content }) => content === '/dora' && 'てってれーーーん',
  ({ content }) => content === '/dio' && 'ムダムダムダムダムダムダムダーーーーッ、、、、ロードローラーだっ',
  ({ content }) => content === '/jj' && 'オラオラオラオラオラオラオラオラーーーーーッ',
  ({ content }) => content === '/sito' && 'パターン青、シトです',
  ({ content }) => content === '/otu' && 'おつかれちゃーーん',
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

  if (!message.guild || message.author.bot) return;

  if (message.content === "/join") {
    if (message.member?.voice?.channel) {
      try {
        _connection = await message.member.voice.channel.join();
        message.channel.send('おじゃまします');
      } catch (e) {
        console.error(e);
        message.channel.send('なんか入れなかった');
      }
    } else {
      message.channel.send('ボイスチャンネルに入ってから呼んでな');
    }

    return;
  }

  if (_connection) {
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
