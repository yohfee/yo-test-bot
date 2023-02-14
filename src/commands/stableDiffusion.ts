import type { Message } from "discord.js";
import type { Command } from "./command";

export type Config = {
  host?: string;
  match: (message: Message) => string | undefined;
};

export const create = ({ host, match }: Config): Command => {
  if (!host) return () => Promise.resolve(false);

  return async (message) => {
    const prompt = match(message);
    if (prompt) {
      const res = await fetch(`${host}/sdapi/v1/txt2img`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, steps: 20 }),
      });
      if (res.status === 200) {
        const { images: [data] } = await res.json();
        await message.channel.send({ files: [{ attachment: Buffer.from(data, "base64") }] });
      } else {
        console.warn(await res.text());
      }
      return true;
    }
    return false;
  };
};
