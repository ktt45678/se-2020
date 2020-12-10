const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const movieHistorySchema = new Schema({
  _id: Number,
  userId: {
    type: Number,
    ref: 'user',
    required: true,
    unique: false
  },
  movieId: {
    type: Number,
    ref: 'movie',
    required: true
  },
  watchCount: {
    type: Number,
    required: true,
    default: 0
  },
  lastWatchedDate: {
    type: Date,
    required: true,
    default: Date.now
  }
}, { _id: false });

movieHistorySchema.plugin(autoIncrement);
const movieHistory = mongoose.model('movie_history', movieHistorySchema);

module.exports = movieHistory;