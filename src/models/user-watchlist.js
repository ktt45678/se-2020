const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const userWatchlistSchema = new Schema({
  _id: Number,
  user: {
    type: Number,
    ref: 'user',
    required: true
  },
  media: {
    type: Number,
    ref: 'media',
    required: true
  }
}, { _id: false, timestamps: true });

userWatchlistSchema.plugin(autoIncrement, { id: 'user_watchlist_id', inc_field: '_id' });
const userWatchlist = mongoose.model('user_watchlist', userWatchlistSchema);

module.exports = userWatchlist;