import { Message } from 'discord.js';

export type Command = (message: Message) => Promise<boolean>;
