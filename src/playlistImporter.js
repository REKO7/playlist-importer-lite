const request = require('request-promise');
const to = require('await-to-js').to;
const jsdom = require('jsdom');
const $ = require('jquery')(new jsdom.JSDOM().window);
const iconv = require('iconv-lite');
const entities = new (require('html-entities').AllHtmlEntities);
const platformChecker = require('./platformChecker');
const parserFactory = require('./parserFactory');

/**
 *
 * @param {string} url
 * @return {string}
 */
const getPlatform = (url) => {
  if (platformChecker.isApple(url)) return 'apple';
  else if (platformChecker.isPandora(url)) return 'pandora';
  else if (platformChecker.isPrimeMusic(url)) return 'prime';
  else if (platformChecker.isSoundcloud(url)) return 'soundcloud';
  else if (platformChecker.isSpotify(url)) return 'spotify';
  else if (platformChecker.isYouTubeMusic(url)) return 'youtube';
  else return null;
};

/**
 *
 * @param {string} url
 * @return {string} formatted url
 */
const formatPlaylistUrl = (url) => {
  let urlToTest = url;
  if (!urlToTest) return url;
  if (!urlToTest.startsWith('https://'))
    if (!urlToTest.startsWith('http://')) urlToTest = `https://${urlToTest}`;
  return urlToTest;
};

/**
 *
 * @param {string} url
 * @param {Function} onResult
 * @return {Promise<Playlist>} Playlist data
 */
const getPlaylistData = async (url) => {
  const formattedUrl = formatPlaylistUrl(url);
  const platform = getPlatform(formattedUrl);
  if (null === platform)
    throw new Error('Invalid/unrecognized playlist link');

  if ('primesoundcloudyoutube'.includes(platform))
    throw new Error('This playlist link is valid but this platform is currently unsupported');

  let [rError, body] = await to(request(formattedUrl));
  if (null !== rError) throw rError;

  body = iconv.decode(Buffer.from(body), 'utf8');
  body = $(body);
  const parser = parserFactory.getParser(platform, $, entities);
  const playlist = parser.parsePlaylist(body);
  return playlist;
};

module.exports = {
  getPlaylistData,
  getPlatform,
};
