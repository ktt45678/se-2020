const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const tvImageSchema = new Schema({
    _id: Number,
    tvId: {
        type: Number,
        require: true
    },
    width: {
        type: Number
    },
    height: {
        type: Number
    },
    filePath: {
        type: String
    },  
}, { _id: false });

tvImageSchema.plugin(autoIncrement);
const tvImage = mongoose.model('tvImage', tvImageSchema);

module.exports = tvImage;