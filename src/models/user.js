const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const userSchema = new Schema({
  _id: Number,
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  displayName: {
    type: String,
  },
  dateOfBirth: {
    type: Date
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    default: 'user'
  },
  locked: {
    type: Boolean,
    require: true,
    default: false
  },
  activationCode: {
    type: String,
    require: true,
  },
  dateAdded: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

userSchema.plugin(autoIncrement);
const user = mongoose.model('user', userSchema);

module.exports = user;