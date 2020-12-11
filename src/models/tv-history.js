const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const tvHistorySchema = new Schema({
  _id: Number,
  userId: {
    type: Number,
    ref: 'user',
    required: true
  },
  tvId: {
    type: Number,
    ref: 'tv_show',
    required: true
  },
  lastWatchedDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  lastEpisodeWatched: {
    type: Number,
    required: true,
    default: -1
  },
}, { _id: false });

tvHistorySchema.plugin(autoIncrement);
const tvHistory = mongoose.model('tv_history', tvHistorySchema);

module.exports = tvHistory;