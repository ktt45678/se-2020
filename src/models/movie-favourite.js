const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const movieFavouriteSchema = new Schema({
  _id: Number,
  userId: {
    type: Number,
    ref: 'user',
    required: true
  },
  movieId: {
    type: Number,
    ref: 'movie',
    required: true
  }
}, { _id: false });

movieFavouriteSchema.plugin(autoIncrement, { id: 'movie_favourite_id', inc_field: '_id' });
const movieFavourite = mongoose.model('movie_favourite', movieFavouriteSchema);

module.exports = movieFavourite;