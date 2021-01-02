const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const mediaCreditSchema = new Schema({
  _id: Number,
  creditId: {
    type: Number,
    ref: 'credit',
    required: true
  },
  mediaId: {
    type: Number,
    ref: 'media',
    required: true
  }
}, { _id: false });

mediaCreditSchema.plugin(autoIncrement, { id: 'media_credit_id', inc_field: '_id' });
const mediaCredit = mongoose.model('media_credit', mediaCreditSchema);

module.exports = mediaCredit;