const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

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
  images: [{
    imageId: Number,
    width: Number,
    height: Number,
    filePath: {
      type: String,
      required: true
    }
  }],
  storages: [{
    blobId: Number,
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
  }]
}, { _id: false });

tvEpisodeSchema.plugin(autoIncrement);
const tvEpisode = mongoose.model('tv_episode', tvEpisodeSchema);

module.exports = tvEpisode;