const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const tvShowVideoSchema = new Schema({
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
}, { _id: false });

const tvShowImageSchema = new Schema({
  _id: Number,
  width: Number,
  height: Number,
  type: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  }
}, { _id: false });

const tvShowSchema = new Schema({
  _id: Number,
  tmdbId: Number,
  title: {
    type: String,
    required: true
  },
  originalTitle: String,
  tagline: String,
  overview: {
    type: String,
    required: true
  },
  episodeRunTime: {
    type: Number,
    required: true
  },
  poster: {
    type: String,
    required: true
  },
  firstAirDate: {
    type: Date,
    required: true
  },
  productionCompanies: {
    type: Array,
    required: true
  },
  genres: {
    type: Array,
    required: true
  },
  popularity: {
    type: Number,
    required: true
  },
  videos: [tvShowVideoSchema],
  images: [tvShowImageSchema],
  dateAdded: {
    type: Date,
    required: true,
    default: Date.now
  }
}, { _id: false });

tvShowVideoSchema.plugin(autoIncrement, { id: 'tv_video_id', inc_field: '_id' });
tvShowImageSchema.plugin(autoIncrement, { id: 'tv_image_id', inc_field: '_id' });
tvShowSchema.plugin(autoIncrement, { id: 'tv_id', inc_field: '_id' });
const tvShow = mongoose.model('tv_show', tvShowSchema);

module.exports = tvShow;