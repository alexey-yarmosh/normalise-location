import { expect } from 'chai'
import { describe, it } from 'mocha'

import { normaliseLocation } from '../src/normalise-country';

// Just test edge cases
describe('normalise location countries', () => {
  it('Geneva CH', () => {
    expect(normaliseLocation('Geneva', { country: 'CH' })).to.equal('Geneva');
    expect(normaliseLocation('Genève', { country: 'CH' })).to.equal('Geneva');
    expect(normaliseLocation('Jenwe', { country: 'CH' })).to.equal('Geneva');
    expect(normaliseLocation('CH6621', { country: 'CH' })).to.equal('Geneva');
    expect(normaliseLocation('Canton of Geneva', { country: 'CH' })).to.equal('Geneva');
  });

  it('Andelfingen CH', () => {
    expect(normaliseLocation('Andelfingen', { country: 'CH' })).to.equal('Andelfingen');
    expect(normaliseLocation('Andelfingen District', { country: 'CH' })).to.equal('Andelfingen');
    expect(normaliseLocation('Bezirk Andelfingen', { country: 'CH' })).to.equal('Andelfingen');
  });

  it('Ceske Budejovice CZ', () => {
    expect(normaliseLocation('Ceske Budejovice', { country: 'CZ' })).to.equal('České Budějovice');
    expect(normaliseLocation('České Budějovice', { country: 'CZ' })).to.equal('České Budějovice');
  });

  it('Hong Kong HK', () => {
    expect(normaliseLocation('Hong Kong', { country: 'HK' })).to.equal('Hong Kong');
  })

  it('St Petersburg RU', () => {
    expect(normaliseLocation('St Petersburg', { country: 'RU' })).to.equal('St Petersburg');
    expect(normaliseLocation('St.-Petersburg', { country: 'RU' })).to.equal('St Petersburg');
    expect(normaliseLocation('Saint Petersburg', { country: 'RU' })).to.equal('St Petersburg');
    expect(normaliseLocation('Sankt-Peterburg', { country: 'RU' })).to.equal('St Petersburg');
  });

  it('New York US', () => {
    expect(normaliseLocation('New York', { country: 'US' })).to.equal('New York');
    expect(normaliseLocation('New York City', { country: 'US' })).to.equal('New York');
  })

  it('Staten Island US', () => {
    expect(normaliseLocation('Staten Island', { country: 'US' })).to.equal('Staten Island');
  })
});

