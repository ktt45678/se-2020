const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const mediaStorageSchema = new Schema({
  _id: Number,
  storage: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  quality: [{
    type: Number,
    required: true
  }],
  mimeType: String
}, { _id: false, timestamps: true });

mediaStorageSchema.plugin(autoIncrement, { id: 'media_storage_id', inc_field: '_id' });
const mediaStorage = mongoose.model('media_storage', mediaStorageSchema);

module.exports = mediaStorage;