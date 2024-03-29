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
  isPublic: {
    type: Boolean,
    required: true,
    default: false
  },
  isAdded: {
    type: Boolean,
    required: true,
    default: false
  },
  isManuallyAdded: {
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
  posterPath: String,
  isPublic: {
    type: Boolean,
    required: true,
    default: false
  },
  isAdded: {
    type: Boolean,
    required: true,
    default: false
  },
  isManuallyAdded: {
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
  posterPath: String,
  backdropPath: String,
  movie: movieSchema,
  tvShow: tvShowSchema,
  videos: [mediaVideoSchema],
  credits: [{
    type: Number,
    ref: 'credit'
  }],
  genres: [String],
  popularity: Number,
  isManuallyAdded: {
    type: Boolean,
    required: true,
    default: false
  },
  isPublic: {
    type: Boolean,
    required: true,
    default: false
  },
  isDeleted: {
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

mediaSchema.statics = {
  findMediaDetailsById: async function (id, isPublic, fields) {
    const filters = { _id: id, isDeleted: false };
    const isValidPublicType = typeof isPublic === 'boolean';
    if (isValidPublicType) {
      filters.isPublic = isPublic;
    }
    fields = fields ?? {};
    fields.isDeleted = 0;
    const result = await this.findOne(filters, fields).populate('credits').populate('movie.stream tvShow.seasons.episodes.stream', 'path').exec();
    // Filter for public data
    if (result?.tvShow && isValidPublicType) {
      result.tvShow.seasons = result.tvShow.seasons.filter(s => s.isPublic === isPublic);
      let i = result.tvShow.seasons.length;
      while (i--) {
        result.tvShow.seasons[i].episodes = result.tvShow.seasons[i].episodes.filter(e => e.isPublic === isPublic);
      }
    }
    return result;
  },
  findLatestMedia: async function (type, isPublic, fields) {
    const filters = { isDeleted: false };
    if (type === 'movie') {
      filters.movie = { $ne: null }
    } else if (type === 'tv') {
      filters.tvShow = { $ne: null }
    }
    const isValidPublicType = typeof isPublic === 'boolean';
    if (isValidPublicType) {
      filters.isPublic = isPublic;
    }
    fields = fields ?? {};
    fields.isDeleted = 0;
    const results = await this.find(filters, fields).sort({ createdAt: -1 }).limit(1).populate('credits').exec();
    const result = results.shift();
    if (result?.tvShow && isValidPublicType) {
      result.tvShow.seasons = result.tvShow.seasons.filter(s => s.isPublic === isPublic);
      let i = result.tvShow.seasons.length;
      while (i--) {
        result.tvShow.seasons[i].episodes = result.tvShow.seasons[i].episodes.filter(e => e.isPublic === isPublic);
      }
    }
    return result;
  },
  fetchMedia: async function (query, type, genre, sort = { createdAt: -1 }, isPublic, skip = 0, limit = 30, atlasSearch = false) {
    const filters = { isDeleted: false };
    if (query && !atlasSearch)
      filters.$text = { $search: query };
    if (type === 'movie')
      filters.movie = { $ne: null };
    else if (type === 'tv')
      filters.tvShow = { $ne: null };
    if (genre)
      filters.genres = genre;
    if (typeof isPublic === 'boolean')
      filters.isPublic = isPublic;
    const aggregate = [
      { $match: filters },
      { $addFields: { releaseDate: { $ifNull: ['$movie.releaseDate', '$tvShow.firstAirDate'] } } },
      { $sort: sort },
      {
        $facet:
        {
          'stage1': [{ $group: { _id: null, count: { $sum: 1 } } }],
          'stage2': [
            { $skip: skip },
            { $limit: limit },
            { $project: { credits: 0, addedBy: 0, videos: 0, 'tvShow.seasons': 0, 'movie.stream': 0, isDeleted: 0, isManuallyAdded: 0, __v: 0 } }
          ]
        }
      },
      { $unwind: '$stage1' },
      { $project: { totalResults: '$stage1.count', results: '$stage2' } }
    ];
    if (query && atlasSearch)
      aggregate.unshift({ $search: { text: { query, path: ['title', 'originalTitle', 'genres'], fuzzy: {} } } });
    return await this.aggregate(aggregate).exec();
  }
}

mediaSchema.index({ title: 'text', originalTitle: 'text', genres: 'text' });
mediaVideoSchema.plugin(autoIncrement, { id: 'media_video_id', inc_field: '_id' });
tvEpisodeSchema.plugin(autoIncrement, { id: 'tv_episode_id', inc_field: '_id' });
tvSeasonSchema.plugin(autoIncrement, { id: 'tv_season_id', inc_field: '_id' });
tvShowSchema.plugin(autoIncrement, { id: 'tv_id', inc_field: '_id' });
movieSchema.plugin(autoIncrement, { id: 'movie_id', inc_field: '_id' });
mediaSchema.plugin(autoIncrement, { id: 'media_id', inc_field: '_id' });
const media = mongoose.model('media', mediaSchema);

module.exports = media;