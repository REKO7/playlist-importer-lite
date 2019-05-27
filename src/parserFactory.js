const ApplePlaylistParser = require('./applePlaylistParser');
const PandoraPlaylistParser = require('./pandoraPlaylistParser');
const SpotifyPlaylistParser = require('./spotifyPlaylistParser');
const platforms = require('./platforms');

class ParserFactory {
  /**
   * @param {string} platform
   * @param {JQuery} jQueryInstance
   * @return {PlaylistParser}
   */
  static getParser(platform, jQueryInstance) {
    switch (platform) {
    case platforms.APPLE: return new ApplePlaylistParser(jQueryInstance);
    case platforms.PANDORA: return new PandoraPlaylistParser(jQueryInstance);
    case platforms.SPOTIFY: return new SpotifyPlaylistParser(jQueryInstance);
    default: return null;
    }
  }
}

module.exports = ParserFactory;
