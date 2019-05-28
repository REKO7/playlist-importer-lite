const PlaylistParser = require('./playlistParser');
const Playlist = require('./playlist');
const Track = require('./track');
const platforms = require('../src/platforms');

class SpotifyPlaylistParser extends PlaylistParser {
  constructor(queryInstance) {
    super(queryInstance);
  }

  queryToJson(playlist) {
    const script = playlist('script:contains(Spotify = {};)').get(0);
    let data = script.firstChild.data.trim();
    const beginString = 'Spotify.Entity = ';
    data = data.substring(data.indexOf(beginString) + beginString.length).slice(0, -1);
    return JSON.parse(data);
  }

  getAuthor(playlist) {
    if (playlist.constructor.name === 'initialize')
      playlist = queryToJson(playlist);
    return playlist.owner.display_name;
  }

  getDescription(playlist) {
    if (playlist.constructor.name === 'initialize')
      playlist = queryToJson(playlist);
    return playlist.description;
  }

  getPhoto(playlist) {
    if (playlist.constructor.name === 'initialize')
      playlist = queryToJson(playlist);
    const img = playlist.images.find((x) => x.height === 640);
    if (undefined === img) {
      if (playlist.images.length > 0)
        return playlist.images[0].url;
      else return null;
    } else return img.url;
  }

  getPlatform() {
    return platforms.SPOTIFY;
  }

  getTitle(playlist) {
    if (playlist.constructor.name === 'initialize')
      playlist = queryToJson(playlist);
    return playlist.name;
  }

  getTracks(playlist) {
    if (playlist.constructor.name === 'initialize')
      playlist = queryToJson(playlist);

    const tracks = playlist.tracks.items.map((item) => {
      const track = {};
      let title = item.track.name;
      const splitIdx = title.indexOf(' (feat.');
      title = splitIdx !== -1 ? title.substring(0, splitIdx) : title;
      track.title = title;
      track.artist = item.track.artists.reduce((result, x, i) => {
        if (i === 0) return result + x.name;
        else return result + `, ${x.name}`;
      }, '');
      track.length = item.track.duration_ms / 1000;
      track.isExplicit = item.track.explicit;
      return new Track(track);
    });

    return tracks;
  }

  parsePlaylist(playlist) {
    const playlistJson = this.queryToJson(playlist);

    const result = {};
    result.author = this.getAuthor(playlistJson);
    result.title = this.getTitle(playlistJson);
    result.description = this.getDescription(playlistJson);
    result.photo = this.getPhoto(playlistJson);
    result.platform = this.getPlatform();
    result.tracklist = this.getTracks(playlistJson);
    return new Playlist(result);
  }
}

module.exports = SpotifyPlaylistParser;

