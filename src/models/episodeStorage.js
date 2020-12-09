const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const episodeStorageSchema = new Schema({
    _id: Number,
    episodeId: {
        type: Number,
        require: true
    },
    storage: {
        type: String
    },
    blobName: {
        type: String
    },
    blobSize: {
        type: String
    },
    quality: {
        type: String
    },
    mimeType: {
        type: String,
    },      
}, { _id: false });

tvEpisodeSchema.plugin(autoIncrement);
const episodeStorage = mongoose.model('episodeStorage', episodeStorageSchema);

module.exports = episodeStorage;