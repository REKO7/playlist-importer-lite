ApplePlaylistParser = require('./applePlaylistParser');
PandoraPlaylistParser = require('./pandoraPlaylistParser');
SpotifyPlaylistParser = require('./spotifyPlaylistParser');

class ParserFactory {
  /**
   * @param {string} platform
   * @param {JQueryStatic} jQueryStatic
   * @param {AllHtmlEntities} entityDecoder
   * @return {PlaylistParser}
   */
  static getParser(platform, jQueryStatic, entityDecoder) {
    switch (platform) {
    case 'apple': return new ApplePlaylistParser(jQueryStatic, entityDecoder);
    case 'pandora': return new PandoraPlaylistParser(jQueryStatic, entityDecoder);
    case 'spotify': return new SpotifyPlaylistParser(jQueryStatic, entityDecoder);
    default: return null;
    }
  }
}

module.exports = ParserFactory;
