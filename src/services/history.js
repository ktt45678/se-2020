const userModel = require("../models/user");
const cloudModule = require("../modules/cloud");
const historyModel = require('../models/user-history');
const mediaModel = require('../models/media');
const miscModule = require('../modules/misc');

exports.getList = async (query, type, genre, sortString, isPublic, page = 1, limit = 30) => {
  const sort = miscModule.toSortQuery(sortString);
  const skip = miscModule.calculatePageSkip(page, limit);

  //lay media để gửi
  //const results = await mediaModel.fetchMedia(query, type, genre, sort, isPublic, skip, limit);
};
