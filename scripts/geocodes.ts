import consola from 'consola';
import { parse } from 'csv-parse';
import { stringifyStream } from '@discoveryjs/json-ext';
import * as fs from 'node:fs';
import * as path from 'pathe';
import type { GeocodeRecord } from './types';
import { isFeatureCode } from '../src/types';

const readStream = fs.createReadStream(path.join(process.cwd(), 'dump/raw/allCountries.txt'), { encoding: 'utf8' });
const writeStreamGeocodes = fs.createWriteStream(path.join(process.cwd(), 'data/geocodes.json'), { encoding: 'utf8' });
const writeStreamGeocodeNames = fs.createWriteStream(path.join(process.cwd(), 'data/geocodeNames.json'), { encoding: 'utf8' });
const geocodes: string[] = [];
const geocodeNames: Record<string, string> = {};

// Initialize the parser
const parser = parse({
  delimiter: '\t',
  encoding: 'utf8',
  relax_quotes: true,
});

// Track what geocodes are used. This helps remove redundant data in geocodeNames.json
parser.on('readable', () => {
  let record: GeocodeRecord;
  // eslint-disable-next-line no-cond-assign
  while ((record = parser.read()) !== null) {
    const population = Number(record[14]);
    if (population > 0 && isFeatureCode(record[7])) {
      geocodes.push(record[0]);
      geocodeNames[record[0]] = record[1];
    }
  }
});
// Catch any error
parser.on('error', (err) => {
  consola.error(err.message);
});

parser.on('end', async () => {
  consola.success('Finished parsing.');

  const writeGeocodes = new Promise((resolve, reject) => {
    stringifyStream(geocodes, null, 2)
      .on('error', reject)
      .pipe(writeStreamGeocodes)
      .on('error', reject)
      .on('finish', resolve);
  });
  await writeGeocodes;
  writeStreamGeocodes.end();
  consola.success(`Finished writing ${geocodes.length} geocodes.`);

  const writeGeocodeNames = new Promise((resolve, reject) => {
    stringifyStream(geocodeNames, null, 2)
      .on('error', reject)
      .pipe(writeStreamGeocodeNames)
      .on('error', reject)
      .on('finish', resolve);
  });
  await writeGeocodeNames;
  writeStreamGeocodeNames.end();
  consola.success(`Finished writing ${geocodes.length} geocode names.`);
});

consola.info('Generating relevant geocodes...');
readStream.pipe(parser);
