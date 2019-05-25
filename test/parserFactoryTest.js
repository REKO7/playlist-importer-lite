const { assert } = require('chai');
ApplePlaylistParser = require('../src/applePlaylistParser');
PandoraPlaylistParser = require('../src/pandoraPlaylistParser');
SpotifyPlaylistParser = require('../src/spotifyPlaylistParser');
const factory = require('../src/parserFactory');

describe('parserFactory', () => {
  it('should return correct parser for each valid platform', () => {
    assert.instanceOf(factory.getParser('apple'), ApplePlaylistParser);
    assert.instanceOf(factory.getParser('pandora'), PandoraPlaylistParser);
    assert.instanceOf(factory.getParser('spotify'), SpotifyPlaylistParser);
  });

  it('should return null for an unsupported platform', () => {
    const unsupported = ['prime', 'youtube', 'soundcloud', 'myspace'];
    for (const platform of unsupported)
      assert.isNull(factory.getParser(platform));
  });
});
