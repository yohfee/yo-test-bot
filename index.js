const fs = require("fs");
const path = require("path");
const Discord = require("discord.js");
const OpenJTalk = require("openjtalk");

const {
  BOT_TOKEN,
} = process.env;

const rules = [
  ({ content, author: { username } }) => username === 'まさほふ' && content === '/unk' && '最強のうんこちんちん',
  ({ content }) => content === '/join' && 'チャリできたっ',
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
  ({ content }) => content === '/mzn' && 'こうべをたれてつくばへ、へいふくせよ',
  ({ content }) => content === '/mznn' && 'なにがまずい、言ってみろ',
  ({ content }) => content === '/bl' && 'バイトリーダー',
  ({ content }) => content
];

const random = max => Math.floor(Math.random() * Math.floor(max))

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

client.login(BOT_TOKEN).catch(console.error);
