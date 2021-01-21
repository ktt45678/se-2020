const mediaService = require('../../services/media');
const { validationResult } = require('express-validator');

exports.index = (req, res) => {
  res.status(200).send({ message: 'Media' });
}

exports.fetch = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const { query, type, genre, sort, page, limit } = req.query;
  const isPublic = req.currentUser?.role !== 'admin' ? true : null;
  try {
    const results = await mediaService.fetchMedia(query, type, genre, sort, isPublic, page, limit);
    res.status(200).send(results);
  } catch (e) {
    next(e);
  }
}

exports.details = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const { id } = req.params;
  const { exclude } = req.query;
  const isPublic = req.currentUser?.role !== 'admin' ? true : null;
  try {
    const media = await mediaService.findMediaDetailsById(id, isPublic, exclude);
    res.status(200).send(media);
  } catch (e) {
    next(e);
  }
}

exports.stream = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const { id } = req.params;
  const { season, episode } = req.query;
  const isPublic = req.currentUser?.role !== 'admin' ? true : null;
  try {
    const media = await mediaService.findMediaDetailsById(id, isPublic, 'credits');
    const streamId = await mediaService.findStreamByMedia(media, season, episode);
    const streamUrls = await mediaService.createStreamUrls(streamId);
    res.status(200).send(streamUrls);
  } catch (e) {
    next(e);
  }
}

exports.addMovie = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const { tmdbId, streamPath, isPublic } = req.body;
  try {
    const movieDocument = await mediaService.createMovieDocument(tmdbId);
    movieDocument.credits = await mediaService.importMovieCredits(tmdbId);
    movieDocument.movie.stream = await mediaService.importStream(streamPath);
    movieDocument.isPublic = isPublic === 'true';
    movieDocument.addedBy = req.currentUser._id;
    const result = await movieDocument.save();
    res.status(200).send({ id: result._id, message: 'Movie has been added successfully' });
  } catch (e) {
    next(e);
  }
}

exports.addTv = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const { tmdbId, isPublic } = req.body;
  try {
    const tvDocument = await mediaService.createTvDocument(tmdbId);
    tvDocument.credits = await mediaService.importTvCredits(tmdbId);
    tvDocument.isPublic = isPublic === 'true';
    tvDocument.addedBy = req.currentUser._id;
    const result = await tvDocument.save();
    res.status(200).send({ id: result._id, message: 'TV Show has been added successfully' });
  } catch (e) {
    next(e);
  }
}

exports.addTvSeason = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const { mediaId, season, isPublic } = req.body;
  try {
    const media = await mediaService.findMediaById(mediaId);
    if (!media?.tvShow) {
      return res.status(404).send({ error: 'TV Show not found' });
    }
    const miniSeason = media.tvShow.seasons.find(s => s.seasonNumber === Number(season));
    if (!miniSeason) {
      return res.status(404).send({ error: 'Season not found' });
    }
    if (miniSeason.isAdded) {
      return res.status(422).send({ error: 'This season has already been added' });
    }
    const seasonObject = await mediaService.createSeasonObject(media.tmdbId, season);
    seasonObject.isPublic = isPublic === 'true';
    seasonObject.isAdded = true;
    miniSeason.set(seasonObject);
    await media.save();
    res.status(200).send({ message: 'Season has been added successfully' });
  } catch (e) {
    next(e);
  }
}

exports.addTvEpisode = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const { mediaId, season, episode, streamPath, isPublic } = req.body;
  try {
    const media = await mediaService.findMediaById(mediaId);
    if (!media?.tvShow) {
      return res.status(404).send({ error: 'TV Show not found' });
    }
    const seasonObject = media.tvShow.seasons.find(s => s.seasonNumber === Number(season));
    if (!seasonObject) {
      return res.status(404).send({ error: 'Season not found' });
    }
    const miniEpisode = seasonObject.episodes.find(s => s.episodeNumber === Number(episode));
    if (!miniEpisode) {
      return res.status(404).send({ error: 'Episode not found' });
    }
    if (miniEpisode.isAdded) {
      return res.status(422).send({ error: 'This episode has already been added' });
    }
    const episodeObject = await mediaService.createEpisodeObject(media.tmdbId, season, episode);
    episodeObject.stream = await mediaService.importStream(streamPath);
    episodeObject.isPublic = isPublic === 'true';
    episodeObject.isAdded = true;
    miniEpisode.set(episodeObject);
    await media.save();
    res.status(200).send({ message: 'Episode has been added successfully' });
  } catch (e) {
    next(e);
  }
}

exports.update = (req, res) => {
  res.status(200).send({ message: 'Update' });
}

exports.delete = (req, res) => {
  res.status(200).send({ message: 'Delete' });
}