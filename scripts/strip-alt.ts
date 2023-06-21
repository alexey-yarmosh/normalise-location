import { stringifyStream } from '@discoveryjs/json-ext';
import consola from 'consola';
import { parse } from 'csv-parse';
import * as fs from 'node:fs';
import * as path from 'pathe';

import geocodesImport from '../data/geocodes.json';

/*
The table 'alternate names' :
-----------------------------
alternateNameId   : the id of this alternate name, int
geonameid         : geonameId referring to id in table 'geoname', int
isolanguage       : iso 639 language code 2- or 3-characters; 4-characters 'post' for postal codes and 'iata','icao' and faac for airport codes, fr_1793 for French Revolution names,  abbr for abbreviation, link to a website (mostly to wikipedia), wkdt for the wikidataid, varchar(7)
alternate name    : alternate name or name variant, varchar(400)
isPreferredName   : '1', if this alternate name is an official/preferred name
isShortName       : '1', if this is a short name like 'California' for 'State of California'
isColloquial      : '1', if this alternate name is a colloquial or slang term. Example: 'Big Apple' for 'New York'.
isHistoric        : '1', if this alternate name is historic and was used in the past. Example 'Bombay' for 'Mumbai'.
from		  : from period when the name was used
to		  : to period when the name was used

Strip everything except geonameId, alternateName
Only select 'en' isoLanguage options,
isShortName takes precedence, if none, isPreferredName takes precedence, else skip */

type Record = [alternateNameid: string, geonameid: string, isolanguage: string, alternateName: string, isPreferredName: string, isShortName: string, isColloquial: string, isHistoric: string, from: string, to: string];

const readStream = fs.createReadStream(path.join(process.cwd(), 'dump/raw/alternateNamesV2.txt'), { encoding: 'utf8' });
const writeStream = fs.createWriteStream(path.join(process.cwd(), 'data/alternateNames.json'), { encoding: 'utf8' });
const usableGeocodes = new Set(geocodesImport as string[]);

interface Locations {
  [geonameid: string]: string[];
}
const records: Locations = {};
// Initialize the parser
const parser = parse({
  delimiter: '\t',
  encoding: 'utf8',
  relax_quotes: true,
});

parser.on('readable', () => {
  let record: Record;
  // eslint-disable-next-line no-cond-assign
  while ((record = parser.read()) !== null) {
    const geonameId = record[1];
    const iso = record[2];
    const altName = record[3];
    // Only refer to iso country codes or undefined, skip post or links, or historical or colloquial
    // if (usableGeocodes.has(geonameId) && iso.length <= 3 && record[6] !== '1' && record[7] !== '1') {

    // Only refer to iso country codes or undefined, skip post or links, or colloquial
    if (usableGeocodes.has(geonameId) && iso.length <= 3 && record[6] !== '1') {
      if (!records[geonameId]) {
        records[geonameId] = [altName];
      } else {
        records[geonameId].push(altName);
      }
    }
  }
});
// Catch any error
parser.on('error', (err) => {
  consola.error(err.message);
});

parser.on('end', async () => {
  consola.success('Finished parsing.');

  const write = new Promise((resolve, reject) => {
    stringifyStream(records, undefined, 2)
      .on('error', reject)
      .pipe(writeStream)
      .on('error', reject)
      .on('finish', resolve);
  });
  await write;
  writeStream.end();
  consola.success('Finished writing.');
});

consola.info('Generating preferred names...');
readStream.pipe(parser);

