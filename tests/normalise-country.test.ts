import { expect } from 'chai';
import { describe, it } from 'mocha';

import { normaliseLocation } from '../src/normalise-country';

// Just test edge cases
describe('normalise location countries', () => {
  it('Saint Petersburg RU', () => {
    expect(normaliseLocation('Saint Petersburg', { country: 'RU' })).to.equal('Saint Petersburg');
    expect(normaliseLocation('St Petersburg', { country: 'RU' })).to.equal('Saint Petersburg');
    expect(normaliseLocation('st petersburg', { country: 'RU' })).to.equal('Saint Petersburg');
  });

  it('Nürnberg DE', () => {
    expect(normaliseLocation('Nürnberg', { country: 'DE' })).to.equal('Nürnberg');
    expect(normaliseLocation('Nuremberg', { country: 'DE' })).to.equal('Nürnberg');
    expect(normaliseLocation('nuremberg', { country: 'DE' })).to.equal('Nürnberg');
  });

  it('Santiago de Querétaro MX', () => {
    expect(normaliseLocation('Querétaro City', { country: 'MX' })).to.equal('Santiago de Querétaro');
    expect(normaliseLocation('Santiago de Querétaro', { country: 'MX' })).to.equal('Santiago de Querétaro');
    expect(normaliseLocation('santiago de queretaro', { country: 'MX' })).to.equal('Santiago de Querétaro');
  });

  it('Frankfurt am Main DE', () => {
    expect(normaliseLocation('Frankfurt am Main', { country: 'DE' })).to.equal('Frankfurt am Main');
    expect(normaliseLocation('frankfurt am main', { country: 'DE' })).to.equal('Frankfurt am Main');
    expect(normaliseLocation('Frankfurt', { country: 'DE' })).to.equal('Frankfurt am Main');
  });

  it('Frankfurt am Main DE', () => {
    expect(normaliseLocation('Frankfurt (Oder)', { country: 'DE' })).to.equal('Frankfurt (Oder)');
    expect(normaliseLocation('frankfurt (oder)', { country: 'DE' })).to.equal('Frankfurt (Oder)');
  });

  it('Bengaluru IN', () => {
    expect(normaliseLocation('Bengaluru', { country: 'IN' })).to.equal('Bengaluru');
    expect(normaliseLocation('bengaluru', { country: 'IN' })).to.equal('Bengaluru');
    expect(normaliseLocation('bangalore', { country: 'IN' })).to.equal('Bengaluru');
  });

// =================================== OLD TESTS

  it('Sydney AU', () => {
    expect(normaliseLocation('Sydney', { country: 'AU' })).to.equal('Sydney');
  });

  it('Brussels BE', () => {
    expect(normaliseLocation('Brussels', { country: 'BE' })).to.equal('Brussels');
    // expect(normaliseLocation('Brussel', { country: 'BE' })).to.equal('Brussels'); // Not a valid input
  });

  it('Sofia BG', () => {
    expect(normaliseLocation('Sofia', { country: 'BG' })).to.equal('Sofia');
  });

  it('Sao Paulo BR', () => {
    expect(normaliseLocation('Sao Paulo', { country: 'BR' })).to.equal('São Paulo');
    expect(normaliseLocation('São Paulo', { country: 'BR' })).to.equal('São Paulo');
    // expect(normaliseLocation('San Paulo', { country: 'BR' })).to.equal('São Paulo'); // Not a valid input
  });

  it('Montréal CA', () => {
    expect(normaliseLocation('Montreal', { country: 'CA' })).to.equal('Montréal');
    expect(normaliseLocation('Montréal', { country: 'CA' })).to.equal('Montréal');
  });

  it('Toronto CA', () => {
    expect(normaliseLocation('Toronto', { country: 'CA' })).to.equal('Toronto');
    // expect(normaliseLocation('Comté de Toronto', { country: 'CA' })).to.equal('Toronto'); // Not a valid input
  });

  it('Andelfingen CH', () => {
    expect(normaliseLocation('Andelfingen', { country: 'CH' })).to.equal('Andelfingen');
    // expect(normaliseLocation('Andelfingen District', { country: 'CH' })).to.equal('Andelfingen'); // It is a district
    // expect(normaliseLocation('Bezirk Andelfingen', { country: 'CH' })).to.equal('Andelfingen'); // It is a district
  });

  it('Genève CH', () => {
    expect(normaliseLocation('Geneva', { country: 'CH' })).to.equal('Genève');
    expect(normaliseLocation('Genève', { country: 'CH' })).to.equal('Genève');
    expect(normaliseLocation('Geneve', { country: 'CH' })).to.equal('Genève');
    // expect(normaliseLocation('Canton of Geneva', { country: 'CH' })).to.equal('Genève'); // It is a district
    // expect(normaliseLocation('Canton de Genève', { country: 'CH' })).to.equal('Genève'); // It is a district
    // expect(normaliseLocation('CH013', { country: 'CH' })).to.equal('Genève'); // Not a valid input
  });

  it('Ceske Budejovice CZ', () => {
    expect(normaliseLocation('Ceske Budejovice', { country: 'CZ' })).to.equal('České Budějovice');
    expect(normaliseLocation('České Budějovice', { country: 'CZ' })).to.equal('České Budějovice');
    // expect(normaliseLocation('Okres České Budějovice', { country: 'CZ' })).to.equal('České Budějovice'); // It is a district
    // expect(normaliseLocation('Ceske Budejovice District', { country: 'CZ' })).to.equal('České Budějovice'); // It is a district
  });

  it('Dusseldorf DE', () => {
    expect(normaliseLocation('Dusseldorf', { country: 'DE' })).to.equal('Düsseldorf');
    expect(normaliseLocation('Düsseldorf', { country: 'DE' })).to.equal('Düsseldorf');
  });

  it('Frankfurt DE', () => {
    expect(normaliseLocation('Frankfurt am Main', { country: 'DE' })).to.equal('Frankfurt am Main');
    // expect(normaliseLocation('Frankfort', { country: 'DE' })).to.equal('Frankfurt am Main'); // Not a valid input
  });

  it('Madrid ES', () => {
    expect(normaliseLocation('Madrid', { country: 'ES' })).to.equal('Madrid');
    // expect(normaliseLocation('Comunidad de Madrid', { country: 'ES' })).to.equal('Madrid'); // It is a district
    // expect(normaliseLocation('Comunidad Autónoma de Madrid', { country: 'ES' })).to.equal('Madrid'); // It is a district
  });

  it('Paris FR', () => {
    expect(normaliseLocation('Paris', { country: 'FR' })).to.equal('Paris');
  });

  it('London GB', () => {
    expect(normaliseLocation('London', { country: 'GB' })).to.equal('London');
  });

  it('Hong Kong HK', () => {
    expect(normaliseLocation('Hong Kong', { country: 'HK' })).to.equal('Hong Kong');
    // expect(normaliseLocation('Hongkong', { country: 'HK' })).to.equal('Hong Kong'); // Not a valid input
    // expect(normaliseLocation('Honkong', { country: 'HK' })).to.equal('Hong Kong'); // Not a valid input
  });

  it('Dublin IE', () => {
    expect(normaliseLocation('Dublin', { country: 'IE' })).to.equal('Dublin');
    expect(normaliseLocation('Dublin City', { country: 'IE' })).to.equal('Dublin');
  });

  it('Petaẖ Tiqva IL', () => {
    expect(normaliseLocation('Petah Tikva', { country: 'IL' })).to.equal('Petaẖ Tiqva');
    expect(normaliseLocation('Petaẖ Tiqva', { country: 'IL' })).to.equal('Petaẖ Tiqva');
    expect(normaliseLocation('Petah Tikwah', { country: 'IL' })).to.equal('Petaẖ Tiqva');
  });

  it('New Delhi IN', () => {
    expect(normaliseLocation('New Delhi', { country: 'IN' })).to.equal('New Delhi');
  });

  it('Seoul KR', () => {
    expect(normaliseLocation('Seoul', { country: 'KR' })).to.equal('Seoul');
    expect(normaliseLocation('Seoul-si', { country: 'KR' })).to.equal('Seoul');
  });

  it('Mexico City MX', () => {
    expect(normaliseLocation('Mexico City', { country: 'MX' })).to.equal('Mexico City');
    // expect(normaliseLocation('Ciudad de México', { country: 'MX' })).to.equal('Mexico City'); // Non EN input
    // expect(normaliseLocation('Mexico', { country: 'MX' })).to.equal('Mexico City'); // It is a district
  });

  it('Tokyo JP', () => {
    expect(normaliseLocation('Tokyo', { country: 'JP' })).to.equal('Tokyo');
    // expect(normaliseLocation('Tokyo Prefecture', { country: 'JP' })).to.equal('Tokyo'); // It is a district
    // expect(normaliseLocation('東京', { country: 'JP' })).to.equal('Tokyo'); // Non EN input
    // expect(normaliseLocation('東京都', { country: 'JP' })).to.equal('Tokyo'); // Non EN input
  });

  it('Ōsaka JP', () => {
    // expect(normaliseLocation('Ōsaka', { country: 'JP' })).to.equal('Osaka'); // Non EN input
    expect(normaliseLocation('Osaka', { country: 'JP' })).to.equal('Osaka');
    // expect(normaliseLocation('Ōsaka Prefecture', { country: 'JP' })).to.equal('Osaka'); // It is a district
    // expect(normaliseLocation('Osaka Prefecture', { country: 'JP' })).to.equal('Osaka'); // It is a district
  });

  it('Almaty KZ', () => {
    expect(normaliseLocation('Almaty', { country: 'KZ' })).to.equal('Almaty');
    // expect(normaliseLocation('Алматы', { country: 'KZ' })).to.equal('Almaty'); // Non EN input
  });

  it('Amsterdam NL', () => {
    expect(normaliseLocation('Amsterdam', { country: 'NL' })).to.equal('Amsterdam');
  });

  it('Kraków PL', () => {
    expect(normaliseLocation('Krakow', { country: 'PL' })).to.equal('Kraków');
    expect(normaliseLocation('Kraków', { country: 'PL' })).to.equal('Kraków');
  });

  it('Bahçelievler TR', () => {
    expect(normaliseLocation('Bahçelievler', { country: 'TR' })).to.equal('Bahçelievler');
  });

  it('Belgrade RS', () => {
    expect(normaliseLocation('Belgrade', { country: 'RS' })).to.equal('Belgrade');
    // expect(normaliseLocation('Beograd', { country: 'RS' })).to.equal('Belgrade'); // It is a district
    // expect(normaliseLocation('Belgrád', { country: 'RS' })).to.equal('Belgrade'); // Non EN input
  });

  it('Moscow RU', () => {
    expect(normaliseLocation('Moscow', { country: 'RU' })).to.equal('Moscow');
    // expect(normaliseLocation('Moskva', { country: 'RU' })).to.equal('Moscow'); // Non EN input
    // expect(normaliseLocation('Москва', { country: 'RU' })).to.equal('Moscow'); // Non EN input
    // expect(normaliseLocation('Moscow Oblast', { country: 'RU' })).to.equal('Moscow'); // It is a district
  });

  it('St Petersburg RU', () => {
    expect(normaliseLocation('St Petersburg', { country: 'RU' })).to.equal('Saint Petersburg');
    expect(normaliseLocation('St.-Petersburg', { country: 'RU' })).to.equal('Saint Petersburg');
    expect(normaliseLocation('Saint Petersburg', { country: 'RU' })).to.equal('Saint Petersburg');
    // expect(normaliseLocation('Sankt-Peterburg', { country: 'RU' })).to.equal('Saint Petersburg'); // Non EN input
  });

  it('Taipei TW', () => {
    expect(normaliseLocation('Taipei', { country: 'TW' })).to.equal('Taipei');
    // expect(normaliseLocation('台北', { country: 'TW' })).to.equal('Taipei'); // Non EN input
    // expect(normaliseLocation('台北市', { country: 'TW' })).to.equal('Taipei'); // Non EN input
    // expect(normaliseLocation('Taipei City', { country: 'TW' })).to.equal('Taipei'); // Not a valid input
  });

  it('Chelsea US', () => {
    expect(normaliseLocation('Chelsea', { country: 'US' })).to.equal('Chelsea');
  });

  it('Newark US', () => {
    expect(normaliseLocation('Newark', { country: 'US' })).to.equal('Newark');
  });

  it('New York City US', () => {
    expect(normaliseLocation('New York', { country: 'US' })).to.equal('New York City');
    expect(normaliseLocation('New York City', { country: 'US' })).to.equal('New York City');
    // expect(normaliseLocation('New York State', { country: 'US' })).to.equal('New York City'); // It is a district
  });

  it('Staten Island US', () => {
    expect(normaliseLocation('Staten Island', { country: 'US' })).to.equal('Staten Island');
    expect(normaliseLocation('Borough of Staten Island', { country: 'US' })).to.equal('Staten Island');
  });

  it('Tampah US', () => {
    expect(normaliseLocation('Tampah', { country: 'US' })).to.equal('Tampah');
  });
});

