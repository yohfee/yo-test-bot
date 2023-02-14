import { Client } from 'discord.js';
import type { Command } from "./commands/command";

export const create = (token: string, commands: Command[]) => {
  const client = new Client().on('message', async message => {
    console.debug(message);

    for (const command of commands) {
      if (await command(message)) break;
    }
  });

  return {
    run: async () => await client.login(token),

    stop: () => {
      client.voice?.connections?.forEach((connection) => {
        connection.disconnect();
        connection.channel.leave();
      });

      client.destroy();
    },
  };
}
