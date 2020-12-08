const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const movieCreditSchema = new Schema({
    _id: Number,
    movieId: {
        type: Number,
        ref: 'movie',
        require: true
    }
}, { _id: false });

movieCreditSchema.plugin(autoIncrement);
const movieCredit = mongoose.model('movieCredit', movieCreditSchema);

module.exports = movieCredit;