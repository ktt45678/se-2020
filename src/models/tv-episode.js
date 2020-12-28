const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const tvEpisodeImageSchema = new Schema({
  _id: Number,
  width: Number,
  height: Number,
  filePath: {
    type: String,
    required: true
  }
}, { _id: false });

const tvEpisodeStorageSchema = new Schema({
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

const tvEpisodeSchema = new Schema({
  _id: Number,
  tvId: {
    type: Number,
    required: true
  },
  season: {
    type: Number,
    required: true
  },
  episodeNumber: {
    type: Number,
    required: true
  },
  runtime: {
    type: Date,
    required: true
  },
  name: String,
  overview: String,
  airDate: {
    type: Date,
    required: true
  },
  images: [tvEpisodeImageSchema],
  storage: [tvEpisodeStorageSchema]
}, { _id: false });

tvEpisodeImageSchema.plugin(autoIncrement, { id: 'tv_episode_image_id', inc_field: '_id' });
tvEpisodeStorageSchema.plugin(autoIncrement, { id: 'tv_episode_storage_id', inc_field: '_id' });
tvEpisodeSchema.plugin(autoIncrement, { id: 'tv_episode_id', inc_field: '_id' });
const tvEpisode = mongoose.model('tv_episode', tvEpisodeSchema);

module.exports = tvEpisode;