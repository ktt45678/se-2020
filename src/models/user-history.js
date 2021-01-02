const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const episodeHistorySchema = new Schema({
  _id: Number,
  episodeNumber: {
    type: Number,
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

const userHistorySchema = new Schema({
  _id: Number,
  userId: {
    type: Number,
    ref: 'user',
    required: true
  },
  mediaId: {
    type: Number,
    ref: 'media',
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
  },
  episodes: [episodeHistorySchema]
}, { _id: false });

episodeHistorySchema.plugin(autoIncrement, { id: 'episode_history_id', inc_field: '_id' });
userHistorySchema.plugin(autoIncrement, { id: 'user_history_id', inc_field: '_id' });
const userHistory = mongoose.model('user_history', userHistorySchema);

module.exports = userHistory;