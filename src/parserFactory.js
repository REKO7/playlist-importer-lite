const ApplePlaylistParser = require('./applePlaylistParser');
const PandoraPlaylistParser = require('./pandoraPlaylistParser');
const SpotifyPlaylistParser = require('./spotifyPlaylistParser');
const platforms = require('./platforms');

class ParserFactory {
  /**
   * @param {string} platform
   * @param {QueryInstance} queryInstance
   * @return {PlaylistParser}
   */
  static getParser(platform, queryInstance) {
    switch (platform) {
    case platforms.APPLE: return new ApplePlaylistParser(queryInstance);
    case platforms.PANDORA: return new PandoraPlaylistParser(queryInstance);
    case platforms.SPOTIFY: return new SpotifyPlaylistParser(queryInstance);
    default: return null;
    }
  }
}

module.exports = ParserFactory;
