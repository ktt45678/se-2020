const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const watchlistSchema = new Schema({
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
  }
}, { _id: false, timestamps: true });

watchlistSchema.statics = {
  findByUserAndMedia: async function (user, media) {
    return await this.findOne({ user, media }).exec();
  },
  fetchList: async function (user, sort = { createdAt: -1 }, skip = 0, limit = 30) {
    const aggregate = [
      { $match: { user } },
      { $lookup: { from: 'media', localField: 'media', foreignField: '_id', as: 'media' } },
      { $unwind: '$media' },
      { $addFields: { 'media.releaseDate': { $ifNull: ['$media.movie.releaseDate', '$media.tvShow.firstAirDate'] } } },
      {
        $facet:
        {
          'stage1': [{ $group: { _id: null, count: { $sum: 1 } } }],
          'stage2': [
            { $skip: skip },
            { $limit: limit },
            { $project: { _id: 1, 'media._id': 1, 'media.tmdbId': 1, 'media.imdbId': 1, 'media.title': 1, 'media.originalTitle': 1, 'media.overview': 1, 'media.movie': 1, 'media.tvShow': 1, 'media.posterPath': 1, 'media.backdropPath': 1, createdAt: 1, updatedAt: 1 } },
            { $unset: ['media.movie.stream', 'media.tvShow.seasons'] }
          ]
        }
      },
      { $unwind: '$stage1' },
      { $project: { totalResults: '$stage1.count', results: '$stage2' } }
    ];
    if (sort) {
      aggregate.splice(2, 0, { $sort: sort });
    }
    return await this.aggregate(aggregate).exec();
  }
}

watchlistSchema.plugin(autoIncrement, { id: 'watchlist_id', inc_field: '_id' });
const watchlist = mongoose.model('watchlist', watchlistSchema);

module.exports = watchlist;