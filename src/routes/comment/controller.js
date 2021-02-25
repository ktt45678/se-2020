const commentService = require('../../services/comment');
const mediaService = require('../../services/media');
const { validationResult } = require('express-validator');

exports.index = (req, res) => {
  res.status(200).send({ message: 'Comment' });
}

exports.fetch = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const { mediaId } = req.params;
  const { sort, page, limit } = req.query;
  const isPublic = req.currentUser?.role !== 'admin' ? true : null;
  try {
    const check = await mediaService.findMediaDetailsById(mediaId, isPublic, 'movie,tvShow,credits,videos', { skipParsing: true });
    if (!check) {
      return res.status(404).send({ error: 'Media not found' });
    }
    const result = await commentService.fetchList(mediaId, sort, page, limit);
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
  const { mediaId, content } = req.body;
  const isPublic = req.currentUser?.role !== 'admin' ? true : null;
  try {
    const check = await mediaService.findMediaDetailsById(mediaId, isPublic, 'movie,tvShow,credits,videos', { skipParsing: true });
    if (!check) {
      return res.status(404).send({ error: 'Media not found' });
    }
    const comment = commentService.createNewComment(_id, mediaId, content);
    await comment.save();
    res.status(200).send({ message: 'Comment has been added successfully' });
  } catch (e) {
    next(e);
  }
}

exports.update = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const { _id } = req.currentUser;
  const { commentId, content } = req.body;
  try {
    const comment = await commentService.findById(commentId);
    if (!comment) {
      return res.status(404).send({ error: 'Comment not found' });
    } else if (comment.user !== _id) {
      return res.status(403).send({ error: 'You do not have permission to update this comment' });
    }
    comment.content = content;
    await comment.save();
    res.status(200).send({ message: 'Comment has been updated successfully' });
  } catch (e) {
    next(e);
  }
}

exports.delete = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const { _id, role } = req.currentUser;
  const { commentId } = req.body;
  try {
    const comment = await commentService.findById(commentId);
    if (!comment || comment.isDeleted) {
      return res.status(404).send({ error: 'Comment not found' });
    } else if (comment.user !== _id && role !== 'admin') {
      return res.status(403).send({ error: 'You do not have permission to delete this comment' });
    }
    comment.isDeleted = true;
    await comment.save();
    res.status(200).send({ message: 'Comment has been deleted successfully' });
  } catch (e) {
    next(e);
  }
}