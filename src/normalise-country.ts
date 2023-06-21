import altNamesCountryImport from './data/altNamesCountry.json';
import type { NormaliseCountryData } from './types';

// Using direct import means the whole file will be 'rolled up' into JS for better memory usage
const altNamesCountry = altNamesCountryImport as NormaliseCountryData;

type Options = { country: string };

const normaliseLocation = (location: string, opts: Options): string => {
  if (altNamesCountry[opts.country] === undefined)
    throw new Error(`No country code!`);

  const altNames = altNamesCountry[opts.country].altNames;
  const loc = location.toLowerCase();

  const index = altNames[loc];
  return index !== undefined ? altNamesCountry[opts.country].normalisedNames[index] : location;
};

export { normaliseLocation };
