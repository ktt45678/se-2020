const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const creditSchema = new Schema({
    _id: Number,
    creditId: {
        type: Number,
        ref: ['tvCredit', 'movieCredit']
    },
    name: {
        type: String,
        required: true,
        unique: false
    },
    originalName: {
        type: String
    },
    avatar: {
        type: String
    },
    department: {
        type: String,
        required: true
    },
    job: {
        type: String,
    },

    //table creditCrew
    crew: [{
        crewId: {
            type: Number
        }
    }],

    //table creditCast
    cast: [{
        castId: {
            type: Number
        },
        character: {
            type: String
        }
    }]
}, { _id: false });

creditSchema.plugin(autoIncrement);
const credit = mongoose.model('credit', creditSchema);

module.exports = credit;