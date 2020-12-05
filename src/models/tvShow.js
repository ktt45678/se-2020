const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const tvShowSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: false
    },
    originalTitle: {
        type: String
    },
    tagline: {
        type: String
    },
    overview: {
        type: String
    },
    episodeCount: {
        type: Number
    },
    episodeRuntime: {
        type: Number
    },
    poster: {
        type: String
    },
    rating: {
        type: Number
    },
    releaseDate: {
        type: Date
    },
    productionCompanies: {
        type: String,
        default: "Updating"
    },
    genres: {
        type: String,
        default: "common"
    },
    popularity: {
        type: Number
    },
    adult: {
        type: Boolean,
        required: true,
        default: true
    }
});

tvShowSchema.plugin(autoIncrement, { inc_field: 'tvId' });
const tvShow = mongoose.model('tvShow', tvShowSchema);

module.exports = tvShow;