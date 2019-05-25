ApplePlaylistParser = require('./applePlaylistParser');
PandoraPlaylistParser = require('./pandoraPlaylistParser');
SpotifyPlaylistParser = require('./spotifyPlaylistParser');

class ParserFactory {
  /**
   * @param {string} platform
   * @param {JQuery} jQueryInstance
   * @return {PlaylistParser}
   */
  static getParser(platform, jQueryInstance) {
    switch (platform) {
    case 'apple': return new ApplePlaylistParser(jQueryInstance);
    case 'pandora': return new PandoraPlaylistParser(jQueryInstance);
    case 'spotify': return new SpotifyPlaylistParser(jQueryInstance);
    default: return null;
    }
  }
}

module.exports = ParserFactory;
