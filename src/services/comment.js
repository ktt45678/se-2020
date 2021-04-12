const commentModel = require('../models/comment');
const miscModule = require('../modules/misc');

exports.fetchList = async (mediaId, sortString = '<createdAt', page = 1, limit = 30) => {
  const sort = miscModule.toSortQuery(sortString);
  const skip = miscModule.calculatePageSkip(page, limit);
  const results = await commentModel.fetchList(mediaId, sort, skip, limit);
  const result = results.shift();
  if (result) {
    result.page = page;
    result.totalPages = Math.ceil(result.totalResults / limit);
    return result;
  }
  return { totalResults: 0, results: [], page, totalPages: 0 };
}

exports.findById = async (id) => {
  return await commentModel.findById(id);
}

exports.findByUserAndMedia = async (userId, mediaId) => {
  return await commentModel.findByUserAndMedia(userId, mediaId);
}

exports.createNewComment = (userId, mediaId, content) => {
  const comment = new commentModel({
    user: userId,
    media: mediaId,
    content
  });
  return comment;
}