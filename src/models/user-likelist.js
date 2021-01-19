const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const userLikelistSchema = new Schema({
  _id: Number,
  user: {
    type: Number,
    ref: 'user',
    require: true
  },
  media: {
    type: Number,
    ref: 'media',
    require: true
  },
  liked: Boolean
}, { _id: false, timestamps: true });

userLikelistSchema.statics = {
  findRecordByUserAndMedia: async function (user, media) {
    return await this.findOne({ user, media }).exec();
  },
  countRecordsByMedia: async function (media, liked) {
    return await this.countDocuments({ media, liked }).exec();
  }
}

userLikelistSchema.plugin(autoIncrement, { id: 'user_likelist_id', inc_field: '_id' });
const userLikelist = mongoose.model('user_likelist', userLikelistSchema);

module.exports = userLikelist;