const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const tvCommentSchema = new Schema({
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
    },
    content: {
        type: String,
        require: true
    }
}, { _id: false });

tvCommentSchema.plugin(autoIncrement);
const tvComment = mongoose.model('tvComment', tvCommentSchema);

module.exports = tvComment;