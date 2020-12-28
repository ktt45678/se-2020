const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const tvFavouriteSchema = new Schema({
  _id: Number,
  userId: {
    type: Number,
    ref: 'user',
    required: true,
    unique: false
  },
  tvId: {
    type: Number,
    ref: 'tv_show',
    required: true
  }
}, { _id: false });

tvFavouriteSchema.plugin(autoIncrement, { id: 'tv_favourite_id', inc_field: '_id' });
const tvFavourite = mongoose.model('tv_favourite', tvFavouriteSchema);

module.exports = tvFavourite;