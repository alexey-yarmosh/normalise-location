import { stringifyStream } from '@discoveryjs/json-ext';
import anyAscii from 'any-ascii';

import consola from 'consola';
import { parse } from 'csv-parse';
import * as fs from 'node:fs';
import * as path from 'pathe';

import geocodeNamesJSON from '../data/geocodeNames.json';
import alternateNamesJSON from '../data/alternateNames.json';
import { FeatureCodes, LocationCountry, LocationObj, Locations } from '../src/types';
import type { AltFinalLocation, GeocodeRecord } from './types';
import { updateRecord } from './utils';


/* The main 'geoname' table has the following fields :
---------------------------------------------------
geonameid         : integer id of record in geonames database
name              : name of geographical point (utf8) varchar(200)
asciiname         : name of geographical point in plain ascii characters, varchar(200)
alternatenames    : alternatenames, comma separated, ascii names automatically transliterated, convenience attribute from alternatename table, varchar(10000)
latitude          : latitude in decimal degrees (wgs84)
longitude         : longitude in decimal degrees (wgs84)
feature class     : see http://www.geonames.org/export/codes.html, char(1)
feature code      : see http://www.geonames.org/export/codes.html, varchar(10)
country code      : ISO-3166 2-letter country code, 2 characters
cc2               : alternate country codes, comma separated, ISO-3166 2-letter country code, 200 characters
admin1 code       : fipscode (subject to change to iso code), see exceptions below, see file admin1Codes.txt for display names of this code; varchar(20)
admin2 code       : code for the second administrative division, a county in the US, see file admin2Codes.txt; varchar(80)
admin3 code       : code for third level administrative division, varchar(20)
admin4 code       : code for fourth level administrative division, varchar(20)
population        : bigint (8 byte int)
elevation         : in meters, integer
dem               : digital elevation model, srtm3 or gtopo30, average elevation of 3''x3'' (ca 90mx90m) or 30''x30'' (ca 900mx900m) area in meters, integer. srtm processed by cgiar/ciat.
timezone          : the iana timezone id (see file timeZone.txt) varchar(40)
modification date : date of last modification in yyyy-MM-dd format

Strip everything asciiname and alternatenames, but skip any feature classes we don't need below.
awk -v lineNo='1500000' 'NR > lineNo{exit};1' allCountries.txt > allCountriesSubset.txt

Feature Classes
A: country, state, region,...
H: stream, lake, ...
L: parks,area, ...
P: city, village,...
R: road, railroad
S: spot, building, farm
T: mountain,hill,rock,...
U: undersea
V: forest,heath,...

We only want to keep A and P. Remove all others. */

const readStream = fs.createReadStream(path.join(process.cwd(), 'dump/raw/allCountries.txt'), { encoding: 'utf8' });
const writeStreamCountry = fs.createWriteStream(path.join(process.cwd(), 'data/alternateNamesCountry.json'), { encoding: 'utf8' });
const geocodeNames = geocodeNamesJSON as AltFinalLocation;
const alternateNames = alternateNamesJSON as Record<string, string[]>;

// const records: Locations = {};

const recordsCountry: LocationCountry = {};

// Initialize the parser
const parser = parse({
  delimiter: '\t',
  encoding: 'utf8',
  relax_quotes: true,
});

parser.on('readable', () => {
  let record: GeocodeRecord;
  // eslint-disable-next-line no-cond-assign
  while ((record = parser.read()) !== null) {
    const geonameId = record[0];
    if (alternateNames[geonameId]) {
      const preferredName = geocodeNames[geonameId] ?? record[1];
      // Use set to get rid of duplicates
      const nameSet = new Set([
        preferredName,
        record[1],
        anyAscii(record[1]),
        ...alternateNames[geonameId],
        ...alternateNames[geonameId].map(anyAscii),
      ]);

      const recordObj: LocationObj = {
        names: [...nameSet],
        preferredName,
        code: record[7] as FeatureCodes,
        geocode: geonameId,
        population: Number(record[14]),
      };

      // Also add to country records
      const countryCode = record[8];
      recordsCountry[countryCode] = recordsCountry[countryCode] ?? {};
      const [newRecord] = updateRecord(recordsCountry[countryCode][preferredName], recordObj);
      recordsCountry[countryCode][preferredName] = newRecord;
    }
  }
});
// Catch any error
parser.on('error', (err) => {
  consola.error(err.message);
});

// Filter out all alt name conflicts with preferred names, every name has to be unique
const cleanRecords = (recordData: Locations): Locations => {
  let repeat = false;
  const recordKeys = Object.keys(recordData);
  for (const preferredName of recordKeys) {
    const record = recordData[preferredName];
    // Note that we delete duplicate records, so object keys can be undefined
    if (record) {
      // Check if any alt names exist in existing records
      for (const altName of record.names) {
        if (recordData[altName]) {
          const [newRecord, hasChanged] = updateRecord(record, recordData[altName]);
          if (hasChanged) {
            repeat = true;
            consola.info(`Replaced ${preferredName} ${record.code} ${record.population} with ${altName} ${newRecord.code} ${newRecord.population}.`);
            delete recordData[preferredName];
            recordData[altName] = newRecord;
          }
        }
      }
    }
  }

  // No point in keeping records with only one name, normaliser will just return loc
  for (const preferredName of Object.keys(recordData)) {
    const recordNames = recordData[preferredName].names;
    if (recordNames.length === 1) {
      delete recordData[preferredName];
    }
  }

  // Recursive because merged names lead to new conflicts
  return repeat ? cleanRecords(recordData) : recordData;
};

parser.on('end', async () => {
  consola.success('Finished parsing.');
  // const cleanedRecords = cleanRecords(records);

  for (const countryCode of Object.keys(recordsCountry)) {
    const cleanedCountryRecords = cleanRecords(recordsCountry[countryCode]);
    recordsCountry[countryCode] = cleanedCountryRecords;
    consola.success(`Finished cleaning ${countryCode}.`);
  }

  consola.success('Finished cleaning out alt name duplicates.');

  /* const writeRecords = new Promise((resolve, reject) => {
    stringifyStream(cleanedRecords, undefined, 2)
      .on('error', reject)
      .pipe(writeStream)
      .on('error', reject)
      .on('finish', resolve);
  });
  await writeRecords;
  writeStream.end(); */

  const writeCountryRecords = new Promise((resolve, reject) => {
    stringifyStream(recordsCountry, undefined, 2)
      .on('error', reject)
      .pipe(writeStreamCountry)
      .on('error', reject)
      .on('finish', resolve);
  });
  await writeCountryRecords;
  writeStreamCountry.end();
  consola.success('Finished writing records.');
});

consola.info('Generating alternate name records...');
readStream.pipe(parser);
