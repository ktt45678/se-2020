const historyService = require('../../services/history');
const mediaService = require('../../services/media');
const { validationResult } = require('express-validator');

exports.index = (req, res) => {
  res.status(200).send({ message: 'History' });
}

exports.fetch = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const { _id } = req.currentUser;
  const { sort, page, limit } = req.query;
  const isPublic = req.currentUser.role !== 'admin' ? true : null;
  try {
    const result = await historyService.fetchList(_id, sort, isPublic, page, limit);
    res.status(200).send(result);
  } catch (e) {
    next(e);
  }
}

exports.get = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const { _id, role } = req.currentUser;
  const { mediaId } = req.params;
  const isPublic = role !== 'admin' ? true : null;
  try {
    const check = await mediaService.findMediaDetailsById(mediaId, isPublic, 'movie,tvShow,credits,videos', { skipParsing: true });
    if (!check) {
      return res.status(404).send({ error: 'Media not found' });
    }
    const result = await historyService.findByUserAndMedia(_id, mediaId);
    if (!result) {
      return res.status(200).send({ message: 'No record' });
    }
    res.status(200).send(result);
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
    const check = await mediaService.findMediaDetailsById(mediaId, isPublic, 'movie,tvShow,credits,videos', { skipParsing: true });
    if (!check) {
      return res.status(404).send({ error: 'Media not found' });
    }
    const search = await historyService.findByUserAndMedia(_id, mediaId);
    if (search) {
      search.watchCount += 1;
      await search.save();
      return res.status(200).send({ message: 'History has been updated successfully' });
    }
    const history = historyService.addToHistory(_id, mediaId);
    await history.save();
    res.status(200).send({ message: 'Media has been added to history' });
  } catch (e) {
    next(e);
  }
}