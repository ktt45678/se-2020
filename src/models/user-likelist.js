const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const userLikelistSchema = new Schema({
  _id: Number,
  user: {
    type: Number,
    ref: 'user',
    require: true
  },
  media: {
    type: Number,
    ref: 'media',
    require: true
  },
  liked: {
    type: Boolean,
    required: true
  }
}, { _id: false, timestamps: true });

userLikelistSchema.plugin(autoIncrement, { id: 'user_likelist_id', inc_field: '_id' });
const userLikelist = mongoose.model('user_likelist_rating', userLikelistSchema);

module.exports = userLikelist;