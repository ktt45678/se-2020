const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const userCommentSchema = new Schema({
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
  content: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean,
    required: true,
    default: false
  },
  dateAdded: {
    type: Date,
    required: true,
    default: Date.now
  },
  dateUpdated: {
    type: Date,
    required: true,
    default: Date.now
  }
}, { _id: false });

userCommentSchema.plugin(autoIncrement, { id: 'user_comment_id', inc_field: '_id' });
const userComment = mongoose.model('user_comment', userCommentSchema);

module.exports = userComment;