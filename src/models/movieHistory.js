const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const movieHistorySchema = new Schema({
    _id: Number,
    userId: {
        type: Number,
        ref: 'user',
        require: true,
        unique: false
    },
    movieId: {
        type: Number,
        ref: 'movie',
        require: true
    },
    watchCount: {
        type: Number,
        required: true
    },
    lastWatchedDate: {
        type: Date,
        required: true,
        default: Date.now()
    }
}, { _id: false });

movieHistorySchema.plugin(autoIncrement);
const movieHistory = mongoose.model('movieHistory', movieHistorySchema);

module.exports = movieHistory;