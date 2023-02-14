import type { Message } from "discord.js";
import type { Command } from "./command";
import { Vocal, create as createVocal } from "./say/vocal";

export type Config = {
  voices: string[];
  minPitch: number;
  pitchRange: number;
  rules: Rule[];
};

export type Rule = ((message: Message) => string | false);

const random = (max: number) => Math.floor(Math.random() * Math.floor(max))

const randomVocal = (voices: string[], minPitch: number, pitchRange: number): Vocal =>
  createVocal(voices[random(voices.length)], minPitch + random(pitchRange));

export const create = ({ voices, minPitch, pitchRange, rules }: Config): Command => {
  const members: { [id: string]: Vocal } = {};

  return async (message) => {
    const { client, guild, author: { id, bot }, member } = message;
    if (!guild || bot) return false;

    const channel = member?.voice.channel;
    if (!channel?.joinable) return false;

    const connection = client.voice?.connections.get(channel.id) || await channel.join();

    const text = rules.reduce((result: string | false, rule) => result ? result : rule(message), false);
    if (!text) return false;

    members[id] ||= randomVocal(voices, minPitch, pitchRange);

    try {
      const { file, dispose } = await members[id](text);
      const dispatcher = connection.play(file);
      dispatcher.on("finish", dispose);
    } catch (error) {
      console.error(error);
    }

    return true;
  }
};
