const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  _id: Number,
  user: {
    type: Number,
    ref: 'user',
    required: true
  },
  media: {
    type: Number,
    ref: 'media',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false
  }
}, { _id: false, timestamps: true });

commentSchema.statics = {
  fetchList: async function (media, sort = { createdAt: -1 }, skip = 0, limit = 30) {
    const aggregate = [
      { $match: { media, isDeleted: false } },
      { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $sort: sort },
      {
        $facet:
        {
          'stage1': [{ $group: { _id: null, count: { $sum: 1 } } }],
          'stage2': [
            { $skip: skip },
            { $limit: limit },
            { $project: { _id: 1, 'user._id': 1, 'user.username': 1, 'user.displayName': 1, content: 1, createdAt: 1, updatedAt: 1 } }
          ]
        }
      },
      { $unwind: '$stage1' },
      { $project: { totalResults: '$stage1.count', results: '$stage2' } }
    ];
    return await this.aggregate(aggregate).exec();
  }
}

commentSchema.index({ content: 'text' }, { default_language: 'none' });
commentSchema.plugin(autoIncrement, { id: 'comment_id', inc_field: '_id' });
const comment = mongoose.model('comment', commentSchema);

module.exports = comment;