const userLikeListModel = require('../models/user-likelist');

exports.rate = async (userId, mediaId, rating) => {
  var ratingRecord = await userLikeListModel.findRecordByUserAndMedia(userId, mediaId);
  if (!ratingRecord) {
    ratingRecord = new userLikeListModel({ user: userId, media: mediaId });
  }
  if (rating === 'like') {
    ratingRecord.liked = true;
  } else if (rating === 'dislike') {
    ratingRecord.liked = false;
  } else {
    ratingRecord.liked = null;
  }
  return ratingRecord;
}

exports.viewRating = async (userId, mediaId) => {
  const ratingRecord = await userLikeListModel.findRecordByUserAndMedia(userId, mediaId);
  if (!ratingRecord) {
    return null;
  }
  return ratingRecord;
}

exports.countRating = async (mediaId, rating) => {
  const liked = rating === 'like';
  const ratingCount = await userLikeListModel.countRecordsByMedia(mediaId, liked);
  return ratingCount;
}