const PlaylistParser = require('./playlistParser');
const Playlist = require('./playlist');
const Track = require('./track');

class PandoraPlaylistParser extends PlaylistParser {
  constructor(jQueryInstance, entityDecoder) {
    super(jQueryInstance, entityDecoder);
  }

  jQueryToJson(playlist) {
    const scripts = [];
    playlist.each((i, item) => {
      if (item.nodeName === 'SCRIPT')
        scripts.push(item);
    });
    const script = scripts.find((x) => x.textContent.trim().startsWith('var launchUrl = '));
    let data = script.textContent.trim();
    const beginString = 'var storeData = ';
    data = data.substring(data.indexOf(beginString) + beginString.length);
    const endIndex = data.indexOf('};');
    data = data.substring(0, endIndex + 1);

    return JSON.parse(data);
  }

  getAuthor(playlist) {
    if (playlist.constructor.name === 'jQuery')
      playlist = jQueryToJson(playlist);
    const playlistV7 = playlist['v7/playlists/getTracks'];
    let author = null;
    if (undefined !== playlistV7)
      author = playlistV7[0].annotations[playlistV7[0].listenerPandoraId].displayname;
    else
      author = 'Pandora';

    return this.entities.decode(author);
  }

  getDescription(playlist) {
    if (playlist.constructor.name === 'jQuery')
      playlist = jQueryToJson(playlist);
    const playlistV7 = playlist['v7/playlists/getTracks'];
    let description = null;
    if (undefined !== playlistV7)
      description = playlistV7[0].description;
    else {
      const playlistV1 = playlist['v1/music/genres'];
      description = playlistV1[0].genres[0].description;
    }
    return this.entities.decode(description);
  }

  getPhoto(playlist) {
    const playlistV1 = playlist['v1/music/genres'];
    let photo = null;
    if (undefined !== playlistV1) {
      photo = playlistV1[0].genres[0].art.find((x) => x.size === 1080);
      if (undefined !== photo)
        photo = photo.url;
      else photo = null;
    }

    return photo;
  }

  getPlatform() {
    return 'Pandora';
  }

  getTitle(playlist) {
    if (playlist.constructor.name === 'jQuery')
      playlist = jQueryToJson(playlist);
    const playlistV7 = playlist['v7/playlists/getTracks'];
    let name = null;
    if (undefined !== playlistV7)
      name = playlistV7[0].name;
    else {
      const playlistV1 = playlist['v1/music/genres'];
      name = playlistV1[0].genres[0].name;
    }
    return this.entities.decode(name);
  }

  getTracks(playlist) {
    if (playlist.constructor.name === 'jQuery')
      playlist = jQueryToJson(playlist);
    const playlistV7 = playlist['v7/playlists/getTracks'];
    const tracks = [];

    if (undefined !== playlistV7) {
      for (const item of playlistV7[0].tracks) {
        const id = item.trackPandoraId;
        const data = playlistV7[0].annotations[id];
        const track = {};
        let title = data.name;
        const splitIdx = title.indexOf(' (feat.');
        title = splitIdx !== -1 ? title.substring(0, splitIdx) : title;
        track.title = this.entities.decode(title);
        track.artist = this.entities.decode(data.artistName).replace(' & ', ', ');
        track.length = item.duration;
        track.isExplicit = data.explicitness === 'EXPLICIT';
        tracks.push(new Track(track));
      }
    } else {
      const playlistV4 = playlist['v4/catalog/getDetails'];
      for (const [key, val] of Object.entries(playlistV4[0].annotations)) {
        if (!key.startsWith('TR:')) continue;
        const track = {};
        let title = val.name;
        const splitIdx = title.indexOf(' (feat.');
        title = splitIdx !== -1 ? title.substring(0, splitIdx) : title;
        track.title = this.entities.decode(title);
        track.artist = this.entities.decode(val.artistName).replace(' & ', ', ');
        track.length = val.duration;
        track.isExplicit = val.explicitness === 'EXPLICIT';
        tracks.push(new Track(track));
      }
    }

    return tracks;
  }

  parsePlaylist(playlist) {
    const playlistJson = this.jQueryToJson(playlist);

    const result = {};
    result.author = this.getAuthor(playlistJson);
    result.title = this.getTitle(playlistJson);
    result.description = this.getDescription(playlistJson);
    result.platform = this.getPlatform();
    result.photo = this.getPhoto(playlistJson);
    result.tracklist = this.getTracks(playlistJson);
    return new Playlist(result);
  }
}

module.exports = PandoraPlaylistParser;
