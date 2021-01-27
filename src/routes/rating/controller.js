const ratingService = require('../../services/rating');
const { validationResult } = require('express-validator');

exports.index = (req, res) => {
  res.status(200).send({ message: 'Rating' });
}

exports.check = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const { id } = req.params;
  const user = req.currentUser;
  try {
    const ratingRecord = await ratingService.viewRating(user._id, id);
    if (!ratingRecord) {
      return res.status(200).send({ liked: null });
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
  const { id } = req.params;
  try {
    const liked = await ratingService.countRating(id, true);
    const disliked = await ratingService.countRating(id, false);
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
  const { id } = req.params;
  const { rating } = req.body;
  const user = req.currentUser;
  try {
    const ratingRecord = await ratingService.rate(user._id, id, rating);
    await ratingRecord.save();
    res.status(200).send({ message: 'Success' });
  } catch (e) {
    next(e);
  }
}