const PlaylistParser = require('./playlistParser');
const queries = require('./queries').appleQueries;
const Playlist = require('./playlist');
const Track = require('./track');
const platforms = require('../src/platforms');

class ApplePlaylistParser extends PlaylistParser {
  constructor(queryInstance) {
    super(queryInstance);
  }

  getAuthor(playlist) {
    const result = playlist(queries.authorQuery).get(0);
    let author = result.children.find((x) => x.name = 'a' && x.firstChild !== null);
    if (author === undefined)
      author = result.firstChild.data.trim();
    else
      author = author.firstChild.data.trim();
    return author;
  }

  getDescription(playlist) {
    let result = playlist(queries.descriptionQuery).get(0);
    if (result === undefined) return null;
    result = result.children.find((x) => x.name === 'p' && x.firstChild !== null);
    const description = result.firstChild.data.trim();
    return description;
  }

  getPhoto(playlist) {
    let result = playlist(queries.photoQuery);
    let source = null;
    if (result.length > 0)
      source = result.get(0).children.find((x) => x.name = 'source' && x.attribs !== undefined);
    if (source === null || source === undefined) return null;
    const srcset = source.attribs.srcset;
    result = srcset.substring(srcset.lastIndexOf('2x,') + 3, srcset.lastIndexOf(' 3x'));
    return result;
  }

  getPlatform() {
    return platforms.APPLE;
  }

  getTitle(playlist) {
    const result = playlist(queries.titleQuery).get(0).firstChild.data.trim();
    return result;
  }

  getTracks(playlist) {
    let telegraphedLength = playlist(queries.telegraphedLengthQuery).get(0);
    telegraphedLength = telegraphedLength.children.find((x) => x.name === 'p');
    telegraphedLength = parseInt(telegraphedLength.firstChild.data.trim().split(' ')[0]);
    const tracks = playlist(queries.trackQuery);
    const titles = playlist(queries.trackTitleQuery);
    const artists = playlist(queries.trackArtistQuery);
    const lengths = playlist(queries.trackLengthQuery);

    if (artists.length !== tracks.length || telegraphedLength !== tracks.length)
      throw new Error('This playlist link seems invalid.');

    const result = [];

    tracks.each((i, item) => {
      const track = {};
      const title = titles.get(i).firstChild.data.trim();
      const splitIdx = title.indexOf(' (feat.');
      track.title = splitIdx !== -1 ? title.substring(0, splitIdx) : title;
      track.artist = artists.get(i).firstChild.data.trim().replace(' & ', ', ');
      track.length = this.timeStringToSeconds(lengths.get(i).firstChild.data);
      track.isExplicit = this.$(item).find(queries.trackIsExplicitQuery).length > 0;
      result.push(new Track(track));
    });

    // Iterator is more useful than raw array
    return result;
  }

  parsePlaylist(playlist) {
    const result = {};
    result.author = this.getAuthor(playlist);
    result.title = this.getTitle(playlist);
    result.description = this.getDescription(playlist);
    result.photo = this.getPhoto(playlist);
    result.platform = this.getPlatform();
    result.tracklist = this.getTracks(playlist);
    return new Playlist(result);
  }
}

module.exports = ApplePlaylistParser;
