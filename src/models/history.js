const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const historySchema = new Schema({
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
historySchema.statics = {
  findByUserId: async function (user) {
    return await this.findOne({ user }).exec();
  },
}
historySchema.plugin(autoIncrement, { id: 'history_id', inc_field: '_id' });
const history = mongoose.model('history', historySchema);

module.exports = history;