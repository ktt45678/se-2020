const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const userWatchlistSchema = new Schema({
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
  dateAdded: {
    type: Date,
    required: true,
    default: Date.now
  }
}, { _id: false });

userWatchlistSchema.plugin(autoIncrement, { id: 'user_watchlist_id', inc_field: '_id' });
const userWatchlist = mongoose.model('user_watchlist', userWatchlistSchema);

module.exports = userWatchlist;