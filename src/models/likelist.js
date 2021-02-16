const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const likelistSchema = new Schema({
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

likelistSchema.statics = {
  findRecordByUserAndMedia: async function (user, media) {
    return await this.findOne({ user, media }).exec();
  },
  countRecordsByMedia: async function (media, liked) {
    return await this.countDocuments({ media, liked }).exec();
  }
}

likelistSchema.plugin(autoIncrement, { id: 'likelist_id', inc_field: '_id' });
const likelist = mongoose.model('likelist', likelistSchema);

module.exports = likelist;