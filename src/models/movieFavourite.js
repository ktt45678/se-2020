const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const movieFavouriteSchema = new Schema({
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
    }
}, { _id: false });

movieFavouriteSchema.plugin(autoIncrement);
const movieFavourite = mongoose.model('movieFavourite', movieFavouriteSchema);

module.exports = movieFavourite;