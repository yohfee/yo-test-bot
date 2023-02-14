import type { Command } from "./command";

export const create = (sdHost?: string): Command => {
  return async (message) => {
    const prompt = message.content.match(/^(.+)画像はこちら。?$/)?.[1];
    if (sdHost && prompt) {
      const res = await fetch(`${sdHost}/sdapi/v1/txt2img`, {
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
