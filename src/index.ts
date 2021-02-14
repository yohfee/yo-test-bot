import createBot from './createBot';

const token = process.env.BOT_TOKEN;
if (!token) {
  console.log('Environment variable BOT_TOKEN is missing.');
  process.exit(1);
}

const bot = createBot(token, [
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
]);

(async () => {
  try {
    console.log(await bot.run());
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
