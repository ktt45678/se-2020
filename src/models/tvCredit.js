const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const tvCreditSchema = new Schema({
    _id: Number,
    tvId: {
        type: Number,
        ref: 'tvShow',
        require: true
    }
}, { _id: false });

tvCreditSchema.plugin(autoIncrement);
const tvCredit = mongoose.model('tvCredit', tvCreditSchema);

module.exports = tvCredit;