const { assert } = require('chai');
const queries = require('../src/queries');
const factory = require('../src/queryFactory');

describe('queryFactory', () => {
  it('should return correct queries for each valid platform', () => {
    assert.deepEqual(factory.getQueries('apple'), queries.appleQueries);
    assert.deepEqual(factory.getQueries('pandora'), queries.pandoraQueries);
    assert.deepEqual(factory.getQueries('spotify'), queries.spotifyQueries);
  });

  it('should return null for an unsupported platform', () => {
    const unsupported = ['prime', 'youtube', 'soundcloud', 'myspace'];
    for (const platform of unsupported)
      assert.isNull(factory.getQueries(platform));
  });
});
