const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const tvFavouriteSchema = new Schema({
    _id: Number,
    userId: {
        type: Number,
        ref: 'user',
        require: true,
        unique: false
    },
    tvId: {
        type: Number,
        ref: 'tvShow',
        require: true
    }
}, { _id: false });

tvFavouriteSchema.plugin(autoIncrement);
const tvFavourite = mongoose.model('tvFavourite', tvFavouriteSchema);

module.exports = tvFavourite;