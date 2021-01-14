const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const userHistorySchema = new Schema({
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
  watchCount: {
    type: Number,
    required: true,
    default: 0
  }
}, { _id: false, timestamps: true });

userHistorySchema.plugin(autoIncrement, { id: 'user_history_id', inc_field: '_id' });
const userHistory = mongoose.model('user_history', userHistorySchema);

module.exports = userHistory;