const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const tvCreditSchema = new Schema({
  _id: Number,
  creditId: {
    type: Number,
    ref: 'credit',
    required: true
  },
  tvId: {
    type: Number,
    ref: 'tv_show',
    required: true
  }
}, { _id: false });

tvCreditSchema.plugin(autoIncrement, { id: 'tv_credit_id', inc_field: '_id' });
const tvCredit = mongoose.model('tv_credit', tvCreditSchema);

module.exports = tvCredit;