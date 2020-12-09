const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const tvRatingSchema = new Schema({
    _id: Number,
    userId: {
        type: Number,
        ref: 'user',
        require: true
    },
    tvId: {
        type: Number,
        ref: 'tvShow',
        require: true
    },
    score: {
        type: Number
    },  
}, { _id: false });

tvRatingSchema.plugin(autoIncrement);
const tvRating = mongoose.model('tvRating', tvRatingSchema);

module.exports = tvRating;