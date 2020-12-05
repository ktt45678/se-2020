const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const movieSchema = new Schema({
    imbd_id: {
        type: Number,
        unique: true
    },
    tagline: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    originalTitle: {
        type: String
    },
    overview: {
        type: String
    },
    runtime: {
        type: Number //minutes
    },
    poster: {
        type: Buffer
    },
    rating: {
        type: mongoose.Types.Decimal128,
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

movieSchema.plugin(autoIncrement, { inc_field: 'movieId' });
const movie = mongoose.model('movie', movieSchema);

module.exports = movie;