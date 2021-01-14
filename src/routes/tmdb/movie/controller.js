const tmdbService = require('../../../services/tmdb');

exports.index = (req, res) => {
  res.status(200).send({ message: 'Movie' });
}

exports.details = async (req, res, next) => {
  const { id } = req.params;
  try {
    const response = await tmdbService.movie(id);
    const data = tmdbService.parseMovieData(response.data);
    res.status(200).send(data);
  } catch (e) {
    next(e)
  }
}

exports.images = async (req, res, next) => {
  const { id } = req.params;
  try {
    const response = await tmdbService.movieImages(id);
    const data = tmdbService.parseImageData(response.data);
    res.status(200).send(data);
  } catch (e) {
    next(e);
  }
}

exports.videos = async (req, res, next) => {
  const { id } = req.params;
  try {
    const response = await tmdbService.movieVideos(id);
    const data = tmdbService.parseVideoData(response.data);
    res.status(200).send(data);
  } catch (e) {
    next(e);
  }
}

exports.credits = async (req, res, next) => {
  const { id } = req.params;
  try {
    const response = await tmdbService.movieCredits(id);
    const data = tmdbService.parseCreditData(response.data);
    res.status(200).send(data);
  } catch (e) {
    next(e);
  }
}