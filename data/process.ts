import { createReadStream, writeFileSync } from 'fs';
import * as csvParser from 'csv-parser';
import { join } from 'path';

const W = /(\w)(\w*)/g;
const R = /\s{2,}/gm;
let results = [];
let i = 1;

createReadStream(join(__dirname, 'data.csv'))
  .pipe(csvParser({}))
  .on('data', (a) => {
    if (results.length >= 100) {
      writeFileSync(join(__dirname, 'd', `data${i}.csv`), results.join('\n'));
      results = [];
      i++;
    }
    results.push(
      [
        `${a.MOBILE}`,
      ].join(',')
    );
  })
  .on('end', () => {
    writeFileSync(join(__dirname, 'd', `data${i}.csv`), results.join('\n'));
  });
