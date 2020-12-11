const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const episodeHistorySchema = new Schema({
  _id: Number,
  userId: {
    type: Number,
    ref: 'user',
    required: true
  },
  episodeId: {
    type: Number,
    ref: 'tv_episode',
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
}, { _id: false });

episodeHistorySchema.plugin(autoIncrement);
const episodeHistory = mongoose.model('episode_history', episodeHistorySchema);

module.exports = episodeHistory;