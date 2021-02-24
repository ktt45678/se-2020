const watchlistService = require('../../services/watchlist');
const mediaService = require('../../services/media');
const { validationResult } = require('express-validator');

exports.index = (req, res) => {
  res.status(200).send({ message: 'Watchlist' });
}

exports.fetch = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const { _id } = req.currentUser;
  const { sort, page, limit } = req.query;
  try {
    const result = await watchlistService.fetchList(_id, sort, page, limit);
    res.status(200).send(result);
  } catch (e) {
    next(e);
  }
}

exports.check = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const { _id } = req.currentUser;
  const { mediaId } = req.params;
  try {
    const result = await watchlistService.findByUserAndMedia(_id, mediaId);
    const isAdded = result ? true : false;
    res.status(200).send({ isAdded });
  } catch (e) {
    next(e);
  }
}

exports.add = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const { _id } = req.currentUser;
  const { mediaId } = req.body;
  const isPublic = req.currentUser?.role !== 'admin' ? true : null;
  try {
    const check = await mediaService.findMediaDetailsById(mediaId, isPublic, 'movie,tvShow,credits,videos');
    if (!check) {
      return res.status(404).send({ error: 'Media not found' });
    }
    const media = watchlistService.addToWatchlist(_id, mediaId);
    await media.save();
    res.status(200).send({ message: 'Media has been added to watchlist' });
  } catch (e) {
    next(e);
  }
}

exports.delete = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const { id } = req.params;
  try {
    const media = await watchlistService.findByIdAndDelete(id);
    if (!media) {
      return res.status(404).send({ error: 'Media not found' });
    }
    res.status(200).send({ message: 'Media has been deleted from watchlist' });
  } catch (e) {
    next(e);
  }
}