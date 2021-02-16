const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const commentSchema = new Schema({
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
  },
  content: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean,
    required: true,
    default: false
  }
}, { _id: false, timestamps: true });

commentSchema.index({ content: 'text' }, { default_language: 'none' });
commentSchema.plugin(autoIncrement, { id: 'comment_id', inc_field: '_id' });
const comment = mongoose.model('comment', commentSchema);

module.exports = comment;