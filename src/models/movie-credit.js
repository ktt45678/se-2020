const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const movieCreditSchema = new Schema({
  _id: Number,
  creditId: {
    type: Number,
    ref: 'credit',
    required: true
  },
  movieId: {
    type: Number,
    ref: 'movie',
    required: true
  }
}, { _id: false });

movieCreditSchema.plugin(autoIncrement);
const movieCredit = mongoose.model('movie_credit', movieCreditSchema);

module.exports = movieCredit;