const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const creditCrewSchema = new Schema({
  _id: Number,
  crewId: {
    type: Number
  }
}, { _id: false });

const creditCastSchema = new Schema({
  _id: Number,
  castId: {
    type: Number
  },
  character: {
    type: String,
    required: true
  }
}, { _id: false });

const creditSchema = new Schema({
  _id: Number,
  creditId: {
    type: Number
  },
  name: {
    type: String,
    required: true,
    unique: false
  },
  originalName: {
    type: String
  },
  avatar: {
    type: String
  },
  department: {
    type: String,
    required: true
  },
  job: {
    type: String,
  },
  crew: [creditCrewSchema],
  cast: [creditCastSchema]
}, { _id: false });

creditCrewSchema.plugin(autoIncrement, { id: 'credit_crew_id', inc_field: '_id' });
creditCastSchema.plugin(autoIncrement, { id: 'credit_cast_id', inc_field: '_id' });
creditSchema.plugin(autoIncrement, { id: 'credit_id', inc_field: '_id' });
const credit = mongoose.model('credit', creditSchema);

module.exports = credit;