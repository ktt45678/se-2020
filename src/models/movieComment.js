const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const movieCommentSchema = new Schema({
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
    content: {
        type: String,
        require: true
    }
}, { _id: false });

movieCommentSchema.plugin(autoIncrement);
const movieComment = mongoose.model('movieComment', movieCommentSchema);

module.exports = movieComment;