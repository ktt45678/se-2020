const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const creditCrewSchema = new Schema({
  _id: Number,
  job: String
}, { _id: false });

const creditCastSchema = new Schema({
  _id: Number,
  character: String
}, { _id: false });

const creditSchema = new Schema({
  _id: Number,
  name: String,
  originalName: String,
  profilePath: String,
  department: String,
  crew: creditCrewSchema,
  cast: creditCastSchema
}, { _id: false, timestamps: true });

creditSchema.statics = {
  findByCredit: async function (credit) {
    const { name, originalName, profilePath, department, cast, crew } = credit;
    return await this.findOne({ name, originalName, profilePath, department, 'cast.character': cast?.character, 'crew.job': crew?.job }).exec();
  }
}

creditCrewSchema.plugin(autoIncrement, { id: 'credit_crew_id', inc_field: '_id' });
creditCastSchema.plugin(autoIncrement, { id: 'credit_cast_id', inc_field: '_id' });
creditSchema.plugin(autoIncrement, { id: 'credit_id', inc_field: '_id' });
const credit = mongoose.model('credit', creditSchema);

module.exports = credit;