const { assert } = require('chai');
const ApplePlaylistParser = require('../src/applePlaylistParser');
const PandoraPlaylistParser = require('../src/pandoraPlaylistParser');
const SpotifyPlaylistParser = require('../src/spotifyPlaylistParser');
const factory = require('../src/parserFactory');
const platforms = require('../src/platforms');

describe('parserFactory', () => {
  it('should return correct parser for each valid platform', () => {
    assert.instanceOf(factory.getParser(platforms.APPLE), ApplePlaylistParser);
    assert.instanceOf(factory.getParser(platforms.PANDORA), PandoraPlaylistParser);
    assert.instanceOf(factory.getParser(platforms.SPOTIFY), SpotifyPlaylistParser);
  });

  it('should return null for an unsupported platform', () => {
    const unsupported = [platforms.PRIME, platforms.YOUTUBE, platforms.SOUNDCLOUD, 'myspace'];
    for (const platform of unsupported)
      assert.isNull(factory.getParser(platform));
  });
});
