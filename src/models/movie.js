const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

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
    type: Number, // Minutes
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

  // Table movieVideo
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
      // Trailer, teaser...
      type: String,
      required: true
    }
  }],

  // Table movieImage
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

  // Table movieStorage
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
  }],
  dateAdded: {
    type: Date,
    required: true,
    default: Date.now
  }
}, { _id: false });

movieSchema.plugin(autoIncrement);
const movie = mongoose.model('movie', movieSchema);

module.exports = movie;