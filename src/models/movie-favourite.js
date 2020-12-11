const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const movieFavouriteSchema = new Schema({
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
  }
}, { _id: false });

movieFavouriteSchema.plugin(autoIncrement);
const movieFavourite = mongoose.model('movie_favourite', movieFavouriteSchema);

module.exports = movieFavourite;