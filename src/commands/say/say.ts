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

type SayResult = {
  file: string
  dispose: () => void
};

export type Say = (text: string) => Promise<SayResult>;

export const create = (voice: string, pitch: number): Say => {
  const vocal: OpenJTalk = new OpenJTalk({
    htsvoice: voice,
  });

  return async text => new Promise((resolve, reject) =>
    vocal._makeWav(text, pitch, (error, result) => {
      if (error) {
        return reject(error);
      }

      const file = path.join(__dirname, '..', result.wav);
      resolve({
        file,
        dispose: () => fs.unlinkSync(file),
      });
    })
  );
};
