const queries = require('./queries');
const platforms = require('./platforms');

class QueryFactory {
  /**
   * @param {string} platform
   * @return {PlaylistQuery}
   */
  static getQueries(platform) {
    switch (platform) {
    case platforms.APPLE: return queries.appleQueries;
    case platforms.PANDORA: return queries.pandoraQueries;
    case platforms.SPOTIFY: return queries.spotifyQueries;
    default: return null;
    }
  }
}

module.exports = QueryFactory;
