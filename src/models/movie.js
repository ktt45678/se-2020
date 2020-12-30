const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const movieVideoSchema = new Schema({
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

const movieImageSchema = new Schema({
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

const movieStorageSchema = new Schema({
  _id: Number,
  storage: {
    type: String,
    required: true
  },
  blobName: {
    type: String,
    required: true
  },
  blobSize: {
    type: Number,
    required: true
  },
  quality: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  }
}, { _id: false });

const movieSchema = new Schema({
  _id: Number,
  imdbId: String,
  tmdbId: Number,
  tagline: String,
  title: {
    type: String,
    required: true
  },
  originalTitle: String,
  overview: {
    type: String,
    required: true
  },
  runtime: {
    type: Number,
    required: true
  },
  poster: {
    type: String,
    required: true
  },
  releaseDate: {
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
  adult: {
    type: Boolean,
    required: true,
    default: false
  },
  videos: [movieVideoSchema],
  images: [movieImageSchema],
  storages: [movieStorageSchema],
  dateAdded: {
    type: Date,
    required: true,
    default: Date.now
  }
}, { _id: false });

movieVideoSchema.plugin(autoIncrement, { id: 'movie_video_id', inc_field: '_id' });
movieImageSchema.plugin(autoIncrement, { id: 'movie_image_id', inc_field: '_id' });
movieStorageSchema.plugin(autoIncrement, { id: 'movie_storage_id', inc_field: '_id' });
movieSchema.plugin(autoIncrement, { id: 'movie_id', inc_field: '_id' });
const movie = mongoose.model('movie', movieSchema);

module.exports = movie;