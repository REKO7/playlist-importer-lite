const Playlist = require('./playlist');

/**
 * Used as an abstract class
 */
class PlaylistParser {
  /**
   * @param {QueryInstance} queryInstance
   */
  constructor(queryInstance) {
    this.$ = queryInstance;
  }

  /**
   * @param {QueryInstance} playlist
   * @return {string}
   */
  getAuthor(playlist) {
    return '';
  }

  /**
   * @param {QueryInstance} playlist
   * @return {string}
   */
  getDescription(playlist) {
    return '';
  }


  /**
   * @param {QueryInstance} playlist
   * @return {string}
   */
  getPhoto(playlist) {
    return '';
  }

  /**
   * @return {string}
   */
  getPlatform() {
    return '';
  }
  /**
   * @param {QueryInstance} playlist
   * @return {string}
   */
  getTitle(playlist) {
    return '';
  }


  /**
   * @param {QueryInstance} playlist
   * @return {Array<Track>}
   */
  getTracks(playlist) {
    return [];
  }

  /**
   * @param {QueryInstance} playlist
   * @return {Playlist}
   */
  parsePlaylist(playlist) {
    return new Playlist();
  }

  /**
 * @param {*} timeStr
 * @return {number}
 */
  timeStringToSeconds(timeStr) {
    // add error handling for NaN parse
    const [minutes, seconds] = timeStr.split(':');
    const minutesNum = parseInt(minutes);
    const secondsNum = parseInt(seconds);
    const timeNum = (minutesNum * 60) + secondsNum;
    return timeNum;
  }
}

module.exports = PlaylistParser;
