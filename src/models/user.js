const bcrypt = require('bcrypt');
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
    type: String
  },
  dateOfBirth: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    default: 'new'
  },
  locked: {
    type: Boolean,
    required: true,
    default: false
  },
  activationCode: {
    type: String
  },
  recoveryCode: {
    type: String
  },
  dateAdded: {
    type: Date,
    required: true,
    default: Date.now
  }
}, { _id: false });

userSchema.statics = {
  findByUsername: async function (username) {
    return this.findOne({ username });
  },
  findByEmail: async function (email) {
    return this.findOne({ email });
  },
  findByUsernameOrEmail: async function (username) {
    return this.findOne({ $or: [{ email: username }, { username: username }] });
  },
  findByActivationCode: async function (activationCode) {
    return this.findOne({ activationCode });
  },
  findByRecoveryCode: async function (recoveryCode) {
    return this.findOne({ recoveryCode });
  },
  resetPassword: async function (recoveryCode, password) {
    return this.findOneAndUpdate({ recoveryCode }, {
      recoveryCode: null,
      password: password
    });
  },
  hashPassword: function (password) {
    return bcrypt.hashSync(password, 10);
  },
  comparePassword: function (password, hash) {
    return bcrypt.compareSync(password, hash);
  }
}

userSchema.plugin(autoIncrement);
const user = mongoose.model('user', userSchema);

module.exports = user;