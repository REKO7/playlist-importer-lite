const queries = require('./queries');

class QueryFactory {
  /**
   * @param {string} platform
   * @return {PlaylistQuery}
   */
  static getQueries(platform) {
    switch (platform) {
    case 'apple': return queries.appleQueries;
    case 'pandora': return queries.pandoraQueries;
    case 'spotify': return queries.spotifyQueries;
    default: return null;
    }
  }
}

module.exports = QueryFactory;
