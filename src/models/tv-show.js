const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const tvShowSchema = new Schema({
  _id: Number,
  title: {
    type: String,
    required: true,
    unique: false
  },
  originalTitle: {
    type: String
  },
  tagline: {
    type: String
  },
  overview: {
    type: String,
    required: true
  },
  episodeCount: {
    type: Number,
    required: true
  },
  poster: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    default: 0
  },
  releaseDate: {
    type: Date,
    required: true
  },
  productionCompanies: {
    type: Array,
    required: true,
    default: []
  },
  genres: {
    type: Array,
    required: true,
    default: []
  },
  popularity: {
    type: Number,
    required: true,
    default: 0
  },
  adult: {
    type: Boolean,
    required: true,
    default: false
  },
  videos: [{
    videoId: Number,
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
  }],
  images: [{
    imageId: Number,
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
  }],
  dateAdded: {
    type: Date,
    required: true,
    default: Date.now
  }
}, { _id: false });

tvShowSchema.plugin(autoIncrement);
const tvShow = mongoose.model('tv_show', tvShowSchema);

module.exports = tvShow;