const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const userStorageSchema = new Schema({
  _id: Number,
  container: {
    type: String,
    required: true
  },
  nanoId: {
    type: String,
    required: true
  },
  blobName: {
    type: String,
    required: true
  },
  blobSize: {
    type: Number,
    required: true
  },
  quality: [{
    type: Number,
    required: true
  }],
  mimeType: {
    type: String,
    required: true
  }
}, { _id: false, timestamps: true });

const userSchema = new Schema({
  _id: Number,
  username: {
    type: String,
    required: true,
    unique: true,
    sparse: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    sparse: true
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
    required: true
  },
  new: {
    type: Boolean,
    required: true,
    default: true
  },
  activationCode: {
    type: String
  },
  recoveryCode: {
    type: String
  },
  storages: [userStorageSchema]
}, { _id: false, timestamps: true });

userSchema.statics = {
  findByUsername: async function (username) {
    return await this.findOne({ username }).exec();
  },
  findByEmail: async function (email) {
    return await this.findOne({ email }).exec();
  },
  findByUsernameOrEmail: async function (username) {
    return await this.findOne({ $or: [{ email: username }, { username: username }] }).exec();
  },
  findByActivationCode: async function (activationCode) {
    return await this.findOne({ activationCode }).exec();
  },
  findByRecoveryCode: async function (recoveryCode) {
    return await this.findOne({ recoveryCode }).exec();
  },
  resetPassword: async function (recoveryCode, password) {
    return await this.findOneAndUpdate({ recoveryCode }, {
      recoveryCode: null,
      password: password
    }).exec();
  },
  hashPassword: async function (password) {
    return await bcrypt.hash(password, 10);
  },
  comparePassword: async function (password, hash) {
    return await bcrypt.compare(password, hash);
  }
}

userSchema.index({ username: 'text', email: 'text', displayName: 'text' }, { default_language: 'none' });
userStorageSchema.plugin(autoIncrement, { id: 'user_storage_id', inc_field: '_id' });
userSchema.plugin(autoIncrement, { id: 'user_id', inc_field: '_id' });
const user = mongoose.model('user', userSchema);

module.exports = user;