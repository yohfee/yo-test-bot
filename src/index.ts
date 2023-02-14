import config from "./config";
import { create as createBot } from "./bot";
import { create as createSayCommand } from "./commands/say";
import { create as createStableDiffusionCommand } from "./commands/stableDiffusion";

if (!config.token) {
  console.log('Environment variable BOT_TOKEN is missing.');
  process.exit(1);
}

const bot = createBot(config.token, [
  createStableDiffusionCommand(config.stableDiffusion),
  createSayCommand(config.say),
]);

["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, () => {
    bot.stop();
    process.exit(0);
  });
});

(async () => {
  try {
    await bot.run();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
