const historyModel = require('../models/history');
const mediaModule = require('../modules/media');
const miscModule = require('../modules/misc');
const config = require('../../config.json').media;

exports.fetchList = async (userId, sortString = 'createdAt:-1', isPublic, page = 1, limit = 30) => {
  const sort = miscModule.toSortQuery(sortString);
  const skip = miscModule.calculatePageSkip(page, limit);
  const results = await historyModel.fetchList(userId, sort, isPublic, skip, limit);
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
  return await historyModel.findByUserAndMedia(userId, mediaId);
}

exports.addToHistory = (userId, mediaId) => {
  const history = new historyModel({
    user: userId,
    media: mediaId,
    watchCount: 1
  });
  return history;
}