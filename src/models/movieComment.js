const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const movieCommentSchema = new Schema({
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
  },
  content: {
    type: String,
    required: true
  },
  dateAdded: {
    type: Date,
    required: true,
    default: Date.now
  }
}, { _id: false });

movieCommentSchema.plugin(autoIncrement);
const movieComment = mongoose.model('movie_comment', movieCommentSchema);

module.exports = movieComment;