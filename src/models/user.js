const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
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
  dateAdded: {
    type: Date,
    default: Date.now
  }
});

userSchema.plugin(autoIncrement, { inc_field: 'userId' });
const User = mongoose.model('User', userSchema);

module.exports = User;