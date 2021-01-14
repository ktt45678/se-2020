const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const mediaVideoSchema = new Schema({
  _id: Number,
  title: String,
  site: {
    type: String,
    required: true
  },
  key: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  }
}, { _id: false, timestamps: true });

const tvEpisodeSchema = new Schema({
  _id: Number,
  seasonNumber: Number,
  episodeNumber: Number,
  runtime: Number,
  name: String,
  overview: String,
  airDate: String,
  stillPath: String,
  stream: {
    type: Number,
    ref: 'media_storage'
  },
  added: {
    type: Boolean,
    required: true,
    default: false
  }
}, { _id: false, timestamps: true });

const tvSeasonSchema = new Schema({
  _id: Number,
  airDate: String,
  seasonNumber: Number,
  episodeCount: Number,
  name: String,
  overview: String,
  psoterPath: String,
  added: {
    type: Boolean,
    required: true,
    default: false
  },
  episodes: [tvEpisodeSchema]
}, { _id: false, timestamps: true });

const tvShowSchema = new Schema({
  _id: Number,
  episodeRuntime: [Number],
  firstAirDate: String,
  lastAirDate: String,
  status: String,
  seasonCount: Number,
  seasons: [tvSeasonSchema]
}, { _id: false });

const movieSchema = new Schema({
  _id: Number,
  runtime: Number,
  releaseDate: String,
  status: String,
  adult: Boolean,
  stream: {
    type: Number,
    ref: 'media_storage'
  }
}, { _id: false });

const mediaSchema = new Schema({
  _id: Number,
  imdbId: String,
  tmdbId: Number,
  tagline: String,
  title: String,
  originalTitle: String,
  overview: String,
  poster_path: String,
  backdrop_path: String,
  movie: movieSchema,
  tvShow: tvShowSchema,
  videos: [mediaVideoSchema],
  credits: [{
    type: Number,
    ref: 'credits'
  }],
  genres: [String],
  popularity: Number,
  published: {
    type: Boolean,
    required: true,
    default: false
  },
  addedBy: {
    type: Number,
    required: true,
    ref: 'user'
  }
}, { _id: false, timestamps: true });

mediaVideoSchema.plugin(autoIncrement, { id: 'media_video_id', inc_field: '_id' });
tvEpisodeSchema.plugin(autoIncrement, { id: 'tv_episode_id', inc_field: '_id' });
tvSeasonSchema.plugin(autoIncrement, { id: 'tv_season_id', inc_field: '_id' });
tvShowSchema.plugin(autoIncrement, { id: 'tv_id', inc_field: '_id' });
movieSchema.plugin(autoIncrement, { id: 'movie_id', inc_field: '_id' });
mediaSchema.plugin(autoIncrement, { id: 'media_id', inc_field: '_id' });
const media = mongoose.model('media', mediaSchema);

module.exports = media;