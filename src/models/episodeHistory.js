const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const episodeHistorySchema = new Schema({
    _id: Number,
    userId: {
        type: Number,
        ref: 'user',
        require: true
    },
    episodeId: {
        type: Number,
        ref: 'tvEpisode',
        require: true
    },
    watchCount: {
        type: Number
    },
    lastWatchedDate: {
        type:Date,
        required: true,
        default: Date.now()
    },       
}, { _id: false });

episodeHistorySchema.plugin(autoIncrement);
const episodeHistory = mongoose.model('episodeHistory', episodeHistorySchema);

module.exports = episodeHistory;