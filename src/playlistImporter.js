const request = require('axios').default;
const to = require('await-to-js').to;
const cheerio = require('cheerio');
const platforms = require('./platforms');
const platformChecker = require('./platformChecker');
const parserFactory = require('./parserFactory');


class ImporterStatic {
  /**
   *
   * @param {string} url
   * @return {string}
   */
  static getPlatform(url) {
    if (platformChecker.isApple(url)) return platforms.APPLE;
    else if (platformChecker.isPandora(url)) return platforms.PANDORA;
    else if (platformChecker.isPrimeMusic(url)) return platforms.PRIME;
    else if (platformChecker.isSoundcloud(url)) return platforms.SOUNDCLOUD;
    else if (platformChecker.isSpotify(url)) return platforms.SPOTIFY;
    else if (platformChecker.isYouTubeMusic(url)) return platforms.YOUTUBE;
    else return null;
  }

  /**
   *
   * @param {string} url
   * @return {string} formatted url
   */
  static formatPlaylistUrl(url) {
    let urlToTest = url;
    if (!urlToTest) return url;
    if (!urlToTest.startsWith('https://'))
      if (!urlToTest.startsWith('http://')) urlToTest = `https://${urlToTest}`;
    return urlToTest;
  }

  /**
   *
   * @param {string} url
   * @param {Function} onResult
   * @return {Promise<Playlist>} Playlist data
   */
  static async getPlaylistData(url) {
    const formattedUrl = this.formatPlaylistUrl(url);
    const platform = this.getPlatform(formattedUrl);
    if (null === platform)
      throw new Error('Invalid/unrecognized playlist link');

    if ([platforms.PRIME, platforms.SOUNDCLOUD, platforms.YOUTUBE].includes(platform))
      throw new Error('This playlist link is valid but this platform is currently unsupported');

    const options = {
      method: 'get',
      url: formattedUrl,
      timeout: 15000,
      responseType: 'text',
      responseEncoding: 'utf8',
    };

    let [rError, body] = await to(request(options));
    if (null !== rError) throw rError;

    body = cheerio.load(body.data, { decodeEntities: true });
    const parser = parserFactory.getParser(platform, body);
    const playlist = parser.parsePlaylist(body);
    return playlist;
  }
};


module.exports = ImporterStatic;
