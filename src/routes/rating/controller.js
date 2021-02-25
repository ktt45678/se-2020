const ratingService = require('../../services/rating');
const mediaService = require('../../services/media');
const { validationResult } = require('express-validator');

exports.index = (req, res) => {
  res.status(200).send({ message: 'Rating' });
}

exports.check = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const { mediaId } = req.params;
  const { _id, role } = req.currentUser;
  const isPublic = role !== 'admin' ? true : null;
  try {
    const check = await mediaService.findMediaDetailsById(mediaId, isPublic, 'movie,tvShow,credits,videos', { skipParsing: true });
    if (!check) {
      return res.status(404).send({ error: 'Media not found' });
    }
    const ratingRecord = await ratingService.viewRating(_id, mediaId);
    if (!ratingRecord) {
      return res.status(200).send({ message: 'No record' });
    }
    res.status(200).send({ liked: ratingRecord.liked });
  } catch (e) {
    next(e);
  }
}

exports.count = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const { mediaId } = req.params;
  const isPublic = req.currentUser?.role !== 'admin' ? true : null;
  try {
    const check = await mediaService.findMediaDetailsById(mediaId, isPublic, 'movie,tvShow,credits,videos', { skipParsing: true });
    if (!check) {
      return res.status(404).send({ error: 'Media not found' });
    }
    const liked = await ratingService.countRating(mediaId, true);
    const disliked = await ratingService.countRating(mediaId, false);
    res.status(200).send({ liked, disliked });
  } catch (e) {
    next(e);
  }
}

exports.rate = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const { mediaId, rating } = req.body;
  const { _id, role } = req.currentUser;
  const isPublic = role !== 'admin' ? true : null;
  try {
    const check = await mediaService.findMediaDetailsById(mediaId, isPublic, 'movie,tvShow,credits,videos', { skipParsing: true });
    if (!check) {
      return res.status(404).send({ error: 'Media not found' });
    }
    const ratingRecord = await ratingService.rate(_id, mediaId, rating);
    await ratingRecord.save();
    res.status(200).send({ message: 'Success' });
  } catch (e) {
    next(e);
  }
}