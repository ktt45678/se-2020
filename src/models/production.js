const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const productionSchema = new Schema({
  _id: Number,
  name: String,
  country: String
}, { _id: false });

productionSchema.plugin(autoIncrement, { id: 'company_id', inc_field: '_id' });
const production = mongoose.model('production', productionSchema);

module.exports = production;