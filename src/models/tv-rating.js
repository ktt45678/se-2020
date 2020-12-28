const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const tvRatingSchema = new Schema({
  _id: Number,
  userId: {
    type: Number,
    ref: 'user',
    require: true
  },
  tvId: {
    type: Number,
    ref: 'tv_show',
    require: true
  },
  score: {
    type: Number,
    required: true
  },
}, { _id: false });

tvRatingSchema.plugin(autoIncrement, { id: 'tv_rating_id', inc_field: '_id' });
const tvRating = mongoose.model('tv_rating', tvRatingSchema);

module.exports = tvRating;