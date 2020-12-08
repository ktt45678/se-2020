const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const movieSchema = new Schema({
    _id: Number,
    imbdId: {
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
    },

    //table movieVideo
    video: [{
        videoId: {
            type: Number
        },
        title: {
            type: String,
        },
        site: {
            type: String,
            required: true
        },
        key: {
            type: String,
            required: true
        },
        type: {  //trailer, teaser
            type: String
        }
    }],

    //table movieImage
    image: [{
        imageId: {
            type: Number
        },
        width: {
            type: Number,
        },
        height: {
            type: Number
        },
        filePath: {
            type: String,
            required: true
        }
    }],

    //table movieStorage
    storage: [{
        blobId: {
            type: Number
        },
        storage: {
            type: String,
            require: true
        },
        blobName: {
            type: String,
            require: true
        },
        blobSize: {
            type: Number,
            require: true
        },
        quality: {
            type: String,
            require: true
        },
        mimeType: {
            type: String,
            require: true
        }
    }]
}, { _id: false });

movieSchema.plugin(autoIncrement);
const movie = mongoose.model('movie', movieSchema);

module.exports = movie;