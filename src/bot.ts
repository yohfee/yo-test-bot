import { Client, VoiceConnection, Message } from 'discord.js';

export type Skill = (connection: VoiceConnection, message: Message) => Promise<boolean>;

export const create = (token: string, skills: Skill[]) => {
  const client = new Client().on('message', async message => {
    console.debug(message);

    const { guild, author: { bot, username }, content, member } = message;

    if (!guild || bot) return;

    console.log(`${username} inputs "${content}"`);

    const channel = member?.voice.channel;
    if (channel && channel.joinable) {
      const connection = client.voice?.connections.get(channel.id) || await channel.join();

      for (let skill of skills) {
        if (await skill(connection, message)) return;
      }
    }
  });

  return {
    run: async () => await client.login(token),
  };
}
