const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const produceSchema = new Schema({
  _id: Number,
  mediaId: {
    type: Number,
    ref: 'media',
    required: true
  },
  companyId: {
    type: Number,
    ref: 'production',
    required: true
  }
}, { _id: false });

produceSchema.plugin(autoIncrement, { id: 'produce_id', inc_field: '_id' });
const produce = mongoose.model('produce', produceSchema);

module.exports = produce;