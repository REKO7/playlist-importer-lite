/**
 * Interface to standardize queries from different platforms
 * Currently only needed by Apple Music since its JSON response is
 * not complete.
 */
class PlaylistQuery {
  constructor(props) {
    this.authorQuery = props.authorQuery;
    this.descriptionQuery = props.descriptionQuery;
    this.photoQuery = props.photoQuery;
    this.trackQuery = props.trackQuery;
    this.trackTitleQuery = props.trackTitleQuery;
    this.trackArtistQuery = props.trackArtistQuery;
    this.titleQuery = props.titleQuery;
    this.trackIsExplicitQuery = props.trackIsExplicitQuery;
    this.trackLengthQuery = props.trackLengthQuery;
    this.telegraphedLengthQuery = props.telegraphedLengthQuery;
  }
}

const appleQueries = new PlaylistQuery({
  authorQuery: 'h2.product-header__identity.album-header__identity',
  descriptionQuery: 'div.we-truncate.we-truncate--multi-line.we-truncate--interactive.ember-view',
  photoQuery: 'picture.we-artwork.ember-view.product-artwork.product-artwork--bottom-separator.product-artwork--captioned.we-artwork--fullwidth',
  trackQuery: 'li.we-selectable-item.is-available.we-selectable-item--allows-interaction.ember-view.tracklist-item.tracklist-item--song.song-list-row',
  trackTitleQuery: 'span.we-truncate.we-truncate--single-line.ember-view.tracklist-item__text__headline.targeted-link__target',
  trackArtistQuery: 'a.table__row__link.table__row__link--secondary',
  titleQuery: 'h1.product-header__title',
  trackIsExplicitQuery: 'div.spread.icon.icon-after.icon-explicit.tracklist-item__explicit',
  trackLengthQuery: 'time.tracklist-item__duration',
  telegraphedLengthQuery: 'div.product-artwork__caption.small-hide.medium-show',
});

const pandoraQueries = new PlaylistQuery({

});

const spotifyQueries = new PlaylistQuery({
  authorQuery: 'div.media-bd h2 span',
  descriptionQuery: 'p.entity-long-description span',
  photoQuery: 'div.cover-art-image',
  trackQuery: 'li.tracklist-row.js-track-row.tracklist-row--track.track-has-preview',
  trackTitleQuery: 'span.track-name',
  trackArtistQuery: 'span.artists-albums',
  titleQuery: 'div.media-bd h1 span',
  trackIsExplicitQuery: 'div.tracklist-col.explicit',
  trackLengthQuery: 'span.total-duration',
  telegraphedLengthQuery: 'p.text-silence.entity-additional-info',
});

module.exports = {
  appleQueries,
  pandoraQueries,
  spotifyQueries,
  PlaylistQuery,
};
