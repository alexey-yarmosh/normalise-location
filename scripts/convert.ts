import { stringifyStream } from '@discoveryjs/json-ext';
import consola from 'consola';
import fs from 'node:fs';
import * as path from 'pathe';

import alternateNamesCountryJSON from '../data/alternateNamesCountry.json';
import type { LocationCountry, NormaliseCountryData } from '../src/types';

const alternateNamesCountry = alternateNamesCountryJSON as LocationCountry;

const createDataCountry = async () => {
  consola.info('Creating src data for countries...');
  const writeStream = fs.createWriteStream(path.join(process.cwd(), 'src/data/altNamesCountry.json'), { encoding: 'utf8' });
  const normalisedData: NormaliseCountryData = {};

  for (const countryCode of Object.keys(alternateNamesCountry)) {
    normalisedData[countryCode] = normalisedData[countryCode] ?? {
      normalisedNames: [],
      altNames: {},
    };

    for (const name of Object.keys(alternateNamesCountry[countryCode])) {
      normalisedData[countryCode].normalisedNames.push(name);
      const index = normalisedData[countryCode].normalisedNames.length - 1; // Faster than running indexOf everytime
      for (const altName of alternateNamesCountry[countryCode][name].names) {
        const nameKey = altName.toLowerCase();
        const altNameIsTaken = normalisedData[countryCode].altNames[nameKey] !== undefined;
        if (altNameIsTaken) {
          const currentIndex = normalisedData[countryCode].altNames[nameKey];
          const currentName = normalisedData[countryCode].normalisedNames[currentIndex];
          const currentPopulation = alternateNamesCountry[countryCode][currentName].population;
          const population = alternateNamesCountry[countryCode][name].population;
          /**
           * In case of alt names conflict in one country we are prefering the bigger city.
           * E.g. Provider returned "Frankfurt", we are choosing "Frankfurt am Main" over "Frankfurt (Oder)".
           */
          if (population > currentPopulation) {
            normalisedData[countryCode].altNames[nameKey] = index;
          }
        } else {
          normalisedData[countryCode].altNames[nameKey] = index;
        }
      }
    }
  }
  const write = new Promise((resolve, reject) => {
    stringifyStream(normalisedData, undefined, 2)
      .on('error', reject)
      .pipe(writeStream)
      .on('error', reject)
      .on('finish', resolve);
  });
  await write;
  writeStream.end();
  consola.success('Finished creating src data for countries.');
};

createDataCountry();
