const { assert } = require('chai');
const queries = require('../src/queries');
const factory = require('../src/queryFactory');
const platforms = require('../src/platforms');

describe('queryFactory', () => {
  it('should return correct queries for each valid platform', () => {
    assert.deepEqual(factory.getQueries(platforms.APPLE), queries.appleQueries);
    assert.deepEqual(factory.getQueries(platforms.PANDORA), queries.pandoraQueries);
    assert.deepEqual(factory.getQueries(platforms.SPOTIFY), queries.spotifyQueries);
  });

  it('should return null for an unsupported platform', () => {
    const unsupported = [platforms.PRIME, platforms.YOUTUBE, platforms.SOUNDCLOUD, 'myspace'];
    for (const platform of unsupported)
      assert.isNull(factory.getQueries(platform));
  });
});
