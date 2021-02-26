import { existsSync } from 'fs';
import { basename } from 'path';
import { Skill } from '../bot';

export default (sounds: string[]): Skill => {
  return async (connection, message) => {
    const { author: { username }, content } = message;

    const sound = sounds.find(s => existsSync(s) && basename(s).startsWith(content));

    if (sound) {
      console.log(`${username} plays "${sound}"`);

      try {
        const dispatcher = connection.play(sound);

        return await new Promise(resolve => {
          dispatcher.on('finish', () => {
            dispatcher.destroy();
            resolve(true);
          });
        });
      } catch (error) {
        console.error(error);
      }
    }

    return false;
  }
}
