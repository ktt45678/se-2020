const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const tvVideoSchema = new Schema({
    _id: Number,
    tvId: {
        type: Number,
        require: true
    },
    title: {
        type: String,
        required: true,
        unique: false
    },
    site: {
        type: String
    },
    key: {
        type: String
    },
    type: {
        type: String
    },   
}, { _id: false });

tvVideoSchema.plugin(autoIncrement);
const tvVideo = mongoose.model('tvVideo', tvVideoSchema);

module.exports = tvVideo;