const PlaylistParser = require('./playlistParser');
const queries = require('./queries').appleQueries;
const Playlist = require('./playlist');
const Track = require('./track');

class ApplePlaylistParser extends PlaylistParser {
  constructor(jQueryInstance, entityDecoder) {
    super(jQueryInstance, entityDecoder);
  }

  getAuthor(playlist) {
    let result = playlist.find(queries.authorQuery)[0];
    const text = result.innerHTML.trim();
    result = text.startsWith('<a') ? result.textContent.trim() : text;
    return this.entities.decode(result);
  }

  getDescription(playlist) {
    let result = playlist.find(queries.descriptionQuery);
    result = result.length > 0 ? this.entities.decode(result[0].textContent.trim()) : null;
    return result;
  }

  getPhoto(playlist) {
    let result = playlist.find(queries.photoQuery);
    const source = result.length > 0 ? result[0].children[0] : null;
    const srcset = source.getAttribute('srcset');
    result = srcset.substring(srcset.lastIndexOf('2x,') + 3, srcset.lastIndexOf(' 3x'));
    return result;
  }

  getPlatform() {
    return 'Apple Music';
  }

  getTitle(playlist) {
    const result = playlist.find(queries.titleQuery)[0].innerHTML.trim();
    return this.entities.decode(result);
  }

  getTracks(playlist) {
    let telegraphedLength = playlist.find(queries.telegraphedLengthQuery)[0];
    telegraphedLength = parseInt(telegraphedLength.textContent.trim().split(' ')[0]);
    const tracks = playlist.find(queries.trackQuery);
    const titles = playlist.find(queries.trackTitleQuery);
    const artists = playlist.find(queries.trackArtistQuery);
    const lengths = playlist.find(queries.trackLengthQuery);

    if (artists.length !== tracks.length || telegraphedLength !== tracks.length)
      throw new Error('This playlist link seems invalid.');

    const result = [];

    tracks.each((i, item) => {
      const track = {};
      const title = titles[i].innerHTML.trim();
      const splitIdx = title.indexOf(' (feat.');
      track.title = this.entities.decode(splitIdx !== -1 ? title.substring(0, splitIdx) : title);
      track.artist = this.entities.decode(artists[i].innerHTML.trim().replace(' & ', ', '));
      track.length = this.timeStringToSeconds(lengths[i].innerHTML);
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
