const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const tvCommentSchema = new Schema({
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

tvCommentSchema.plugin(autoIncrement);
const tvComment = mongoose.model('tv_comment', tvCommentSchema);

module.exports = tvComment;