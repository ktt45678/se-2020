const config = require('../../config.json').media;
const watchlistModel = require('../models/watchlist');
const mediaModule = require('../modules/media');
const miscModule = require('../modules/misc');

exports.fetchList = async (userId, sortString = 'createdAt:-1', page = 1, limit = 30) => {
  const sort = miscModule.toSortQuery(sortString);
  const skip = miscModule.calculatePageSkip(page, limit);
  const results = await watchlistModel.fetchList(userId, sort, skip, limit);
  const result = results.shift();
  if (result) {
    let i = result.results.length;
    while (i--) {
      result.results[i].media = mediaModule.parseMediaResult(config.poster_url, config.backdrop_url, result.results[i].media);
    }
    result.page = page;
    result.totalPages = Math.ceil(result.totalResults / limit);
    return result;
  }
  return { totalResults: 0, results: [], page, totalPages: 0 };
}

exports.findByUserAndMedia = async (userId, mediaId) => {
  return await watchlistModel.findByUserAndMedia(userId, mediaId);
}

exports.addToWatchlist = (userId, mediaId) => {
  const media = new watchlistModel({
    user: userId,
    media: mediaId
  });
  return media;
}

exports.findByIdAndDelete = async (id) => {
  return await watchlistModel.findByIdAndDelete(id);
}