const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const mediaStorageSchema = new Schema({
  _id: Number,
  path: {
    type: String,
    required: true
  },
  file: {
    type: String,
    required: true
  },
  quality: [{
    type: Number,
    required: true
  }],
  mimeType: {
    type: String,
    required: true
  }
}, { _id: false, timestamps: true });

mediaStorageSchema.statics = {
  findByPath: async function (path) {
    return await this.findOne({ path }).exec();
  }
}

mediaStorageSchema.plugin(autoIncrement, { id: 'media_storage_id', inc_field: '_id' });
const mediaStorage = mongoose.model('media_storage', mediaStorageSchema);

module.exports = mediaStorage;