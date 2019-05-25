const chai = require('chai');
const chaiAsync = require('chai-as-promised');
chai.use(chaiAsync);
const { assert, expect } = chai;
const importer = require('../src/playlistImporter');


describe('playlistImporter', () =>{
  describe('getPlatform', () => {
    it('should identify correct platforms', () => {
      const appleUrl = 'https://itunes.apple.com/us/playlist/the-a-list-african-music/pl.a0';
      const pandoraPUrl = 'https://www.pandora.com/playlist/PL:13538199:568893875';
      const pandoraGUrl = 'https://pandora.com/genre/rap-and-hip-hop-pre-game';
      const spotifyUrl = 'https://open.spotify.com/playlist/2n8POxkiNjLibFSTwe4u7p';

      expect(importer.getPlatform(appleUrl)).to.eql('apple');
      expect(importer.getPlatform(pandoraGUrl)).to.eql('pandora');
      expect(importer.getPlatform(pandoraPUrl)).to.eql('pandora');
      expect(importer.getPlatform(spotifyUrl)).to.eql('spotify');
    });

    it('should throw for invalid platforms', () => {
      const invalidAppleUrl = 'https://itunes.apple.com/us/untitled-playlist/pl.u-z';
      const invalidPandPUrl = 'https://www.pandora.com/playlist/GL:13538199:568893875';
      const invalidPandGUrl = 'https://www.pandora.com/rap-and-hip-hop-pre-game';
      const invalidSpotUrl = 'https://open.spotify.com/2n8POxkiNjLibFSTwe4u7p';
      const genericInvalidUrl = 'https://github.com/enioluwa23';

      expect(importer.getPlatform(invalidAppleUrl)).to.eql(null);
      expect(importer.getPlatform(invalidPandGUrl)).to.eql(null);
      expect(importer.getPlatform(invalidPandPUrl)).to.eql(null);
      expect(importer.getPlatform(invalidSpotUrl)).to.eql(null);
      expect(importer.getPlatform(genericInvalidUrl)).to.eql(null);
    });
  });

  describe('getPlaylistData', () => {
    it('should throw for invalid link', async () => {
      const url = 'https://open.spotify.com/2n8POxkiNjLibFSTwe4u7p';
      await assert.isRejected(importer.getPlaylistData(url), Error, 'Invalid/unrecognized playlist link');
    });

    it('should throw for valid links from platforms with planned support', async () => {
      const futureSupportedUrls = [];
      futureSupportedUrls.push('https://soundcloud.com/james-vanho/sets/melodic-dubstep');
      futureSupportedUrls.push('https://music.amazon.com/playlists/B07R5CN9D1');
      futureSupportedUrls.push('https://music.youtube.com/playlist?list=RDCLAK5uy_k2pS49OPwSZtJeXgWnvAPmlB8gJCphDes');

      for (const url of futureSupportedUrls) {
        await assert.isRejected(importer.getPlaylistData(url), Error,
          'This playlist link is valid but this platform is currently unsupported');
      }
    });

    it('should import apple music playlist correctly', async () => {
      const url = 'https://music.apple.com/us/playlist/for-eni/pl.u-8aAVXEeIoXao3z4';
      const expected = {
        title: 'For Eni',
        description: null,
        photo: 'https://is4-ssl.mzstatic.com/image/thumb/4dYzvPJh_kMbGoZjn4877g/939x939cc.jpg',
        platform: 'Apple Music',
        author: 'Temiloluwa Segun',
        tracklist: [
          {
            title: 'Money Good',
            artist: 'Megan Thee Stallion',
            length: 197,
            isExplicit: true,
          },
          {
            title: 'Surf',
            artist: 'King Combs',
            length: 211,
            isExplicit: true,
          },
          {
            title: 'Startender',
            artist: 'A Boogie wit da Hoodie',
            length: 192,
            isExplicit: true,
          },
        ],
      };
      const result = await importer.getPlaylistData(url);
      assert.deepEqual(result, expected);
    });

    it('should import spotify playlist correctly', async () => {
      const url = 'https://open.spotify.com/playlist/4XMzwJePdl7QRU2q0xe7iL?si=jQM5kk3VTEWNhsFfn-FUZg';
      const expected = {
        title: 'Test',
        description: 'Test playlist for development purposes.',
        photo: 'https://i.scdn.co/image/0a5e2d5e7cc1a016deaec7dfaf1c0787fecb9cfe',
        platform: 'Spotify',
        author: 'Enioluwa Segun',
        tracklist: [
          {
            title: 'Daft Punk',
            artist: 'Pentatonix',
            length: 248.56,
            isExplicit: false,
          },
          {
            title: 'Superheroes',
            artist: 'Daft Punk',
            length: 237.8,
            isExplicit: false,
          },
          {
            title: 'Late Night',
            artist: 'GoldLink, Masego',
            length: 161.08,
            isExplicit: true,
          },
        ],
      };
      const result = await importer.getPlaylistData(url);
      assert.deepEqual(result, expected);
    });

    it('should import pandora playlist correctly', async () => {
      const url = 'https://www.pandora.com/playlist/PL:281474989394370:1742630896';
      const expected = {
        title: 'Only the Love Songs: George Strait',
        description: 'The King of Country sings Strait from the heart.',
        photo: null,
        platform: 'Pandora',
        author: 'Pandora Country',
        tracklist: [
          {
            title: 'Give It All We Got Tonight',
            artist: 'George Strait',
            length: 251,
            isExplicit: false,
          },
          {
            title: 'The Chair',
            artist: 'George Strait',
            length: 171,
            isExplicit: false,
          },
          {
            title: 'I Got A Car',
            artist: 'George Strait',
            length: 272,
            isExplicit: false,
          },
          {
            title: 'I\'m Never Gonna Let You Go',
            artist: 'George Strait',
            length: 190,
            isExplicit: false,
          },
          {
            title: 'One Night At A Time',
            artist: 'George Strait',
            length: 232,
            isExplicit: false,
          },
          {
            title: 'My Heart Won\'t Wander Very Far From You',
            artist: 'George Strait',
            length: 144,
            isExplicit: false,
          },
          {
            title: 'Love Without End, Amen',
            artist: 'George Strait',
            length: 184,
            isExplicit: false,
          },
          {
            title: 'River Of Love',
            artist: 'George Strait',
            length: 195,
            isExplicit: false,
          },
          {
            title: 'I Cross My Heart',
            artist: 'George Strait',
            length: 211,
            isExplicit: false,
          },
          {
            title: 'Check Yes Or No',
            artist: 'George Strait',
            length: 191,
            isExplicit: false,
          },
          {
            title: 'If I Know Me',
            artist: 'George Strait',
            length: 162,
            isExplicit: false,
          },
          {
            title: 'Carried Away',
            artist: 'George Strait',
            length: 178,
            isExplicit: false,
          },
          {
            title: 'Blue Clear Sky',
            artist: 'George Strait',
            length: 173,
            isExplicit: false,
          },
          {
            title: 'My Infinite Love',
            artist: 'George Strait',
            length: 225,
            isExplicit: false,
          },
          {
            title: 'I Look At You',
            artist: 'George Strait',
            length: 208,
            isExplicit: false,
          },
          {
            title: 'Carrying Your Love With Me',
            artist: 'George Strait',
            length: 230,
            isExplicit: false,
          },
        ],
      };

      const result = await importer.getPlaylistData(url);
      assert.deepEqual(result, expected);
    });
  });
});
