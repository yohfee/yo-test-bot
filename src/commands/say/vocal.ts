import fs from 'fs';
import path from 'path';

const OpenJTalk = require('openjtalk');

type MakeWavResult = {
  wav: string
};

type MakeWavCallback = (error: Error, result: MakeWavResult) => void;

type OpenJTalk = {
  _makeWav: (text: string, pitch: number, callback: MakeWavCallback) => void
};

type VocalResult = {
  file: string
  dispose: () => void
};

export type Vocal = (text: string) => Promise<VocalResult>;

export const create = (voice: string, pitch: number): Vocal => {
  const vocal: OpenJTalk = new OpenJTalk({
    htsvoice: voice,
  });

  return async text => new Promise((resolve, reject) =>
    vocal._makeWav(text, pitch, (error, result) => {
      if (error) {
        return reject(error);
      }

      const file = path.join(process.cwd(), result.wav);
      resolve({
        file,
        dispose: () => fs.unlinkSync(file),
      });
    })
  );
};
