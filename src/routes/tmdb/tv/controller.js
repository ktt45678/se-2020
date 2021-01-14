const tmdbService = require('../../../services/tmdb');

exports.index = (req, res) => {
  res.status(200).send({ message: 'TV Show' });
}

exports.details = async (req, res, next) => {
  const { id } = req.params;
  try {
    const response = await tmdbService.tv(id);
    const data = tmdbService.parseTvData(response.data);
    res.status(200).send(data);
  } catch (e) {
    next(e);
  }
}

exports.images = async (req, res, next) => {
  const { id } = req.params;
  try {
    const response = await tmdbService.tvImages(id);
    const data = tmdbService.parseImageData(response.data);
    res.status(200).send(data);
  } catch (e) {
    next(e);
  }
}

exports.videos = async (req, res, next) => {
  const { id } = req.params;
  try {
    const response = await tmdbService.tvVideos(id);
    const data = tmdbService.parseVideoData(response.data);
    res.status(200).send(data);
  } catch (e) {
    next(e)
  }
}

exports.credits = async (req, res, next) => {
  const { id } = req.params;
  try {
    const response = await tmdbService.tvCredits(id);
    const data = tmdbService.parseCreditData(response.data);
    res.status(200).send(data);
  } catch (e) {
    next(e);
  }
}

exports.season = async (req, res, next) => {
  const { id, season } = req.params;
  try {
    const response = await tmdbService.tvSeason(id, season);
    const data = tmdbService.parseSeasonData(response.data);
    res.status(200).send(data);
  } catch (e) {
    next(e)
  }
}

exports.episode = async (req, res, next) => {
  const { id, season, episode } = req.params;
  try {
    const response = await tmdbService.tvEpisode(id, season, episode);
    const data = tmdbService.parseEpisodeData(response.data);
    res.status(200).send(data);
  } catch (e) {
    next(e);
  }
}