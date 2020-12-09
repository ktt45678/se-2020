const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const tvEpisodeSchema = new Schema({
    _id: Number,
    tvId: {
        type: Number,
        require: true
    },
    season: {
        type: Number
    },
    episodeNumber: {
        type: Number
    },
    runtime: {
        type: Date
    },
    overview: {
        type: String
    },
    airDate: {
        type: Date,
        default: Date.now
    },      
}, { _id: false });

tvEpisodeSchema.plugin(autoIncrement);
const tvEpisode = mongoose.model('tvEpisode', tvEpisodeSchema);

module.exports = tvEpisode;