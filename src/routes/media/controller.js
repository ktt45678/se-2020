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
  // Force to remove stream from query
  req.query.exclusions = req.query.exclusions ? req.query.exclusions + ',movie.stream,tvShow.seasons.episodes.stream' : 'movie.stream,tvShow.seasons.episodes.stream';
  const { id } = req.params;
  const { exclusions } = req.query;
  const isPublic = req.currentUser?.role !== 'admin' ? true : null;
  try {
    const media = await mediaService.findMediaDetailsById(id, isPublic, exclusions);
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
  const { tmdbId, streamPath, isPublic, override } = req.body;
  try {
    const media = tmdbId ? await mediaService.createMovieDocument(tmdbId, override) : mediaService.createNewMovieDocument(override);
    if (!media.isManuallyAdded) {
      mediaService.updateMovie(media, override);
    }
    media.credits = tmdbId ? await mediaService.importMovieCredits(tmdbId) : [];
    media.movie.stream = await mediaService.importStream(streamPath);
    media.isPublic = isPublic;
    media.addedBy = req.currentUser._id;
    const result = await media.save();
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
  const { tmdbId, isPublic, override } = req.body;
  try {
    const media = tmdbId ? await mediaService.createTvDocument(tmdbId, override) : mediaService.createNewTvDocument(override);
    if (!media.isManuallyAdded) {
      mediaService.updateTv(media, override);
    }
    media.credits = tmdbId ? await mediaService.importTvCredits(tmdbId) : [];
    media.isPublic = isPublic;
    media.addedBy = req.currentUser._id;
    const result = await media.save();
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
  const { mediaId, season, isPublic, override } = req.body;
  try {
    const media = await mediaService.findMediaById(mediaId);
    const miniSeason = mediaService.findTvSeason(media, season);
    if (miniSeason?.isAdded) {
      return res.status(422).send({ error: 'This season has already been added' });
    }
    // Create from an existing season on TMDb or manually
    const isTmdbShow = miniSeason && !miniSeason.isManuallyAdded;
    const seasonDocument = isTmdbShow ? await mediaService.createSeasonDocument(media.tmdbId, season, override) : mediaService.createNewSeasonDocument(season, override);
    if (!seasonDocument.isManuallyAdded) {
      mediaService.updateTvSeason(seasonDocument, override);
    }
    seasonDocument.isPublic = isPublic;
    // Overwrite for existing seasons or push for new ones
    if (miniSeason) {
      miniSeason.set(seasonDocument);
    } else {
      media.tvShow.seasons.push(seasonDocument);
      media.tvShow.seasonCount++;
    }
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
  const { mediaId, season, episode, streamPath, isPublic, override } = req.body;
  try {
    const media = await mediaService.findMediaById(mediaId);
    const seasonDocument = mediaService.findTvSeason(media, season);
    const miniEpisode = mediaService.findSeasonEpisode(seasonDocument, episode);
    if (miniEpisode?.isAdded) {
      return res.status(422).send({ error: 'This episode has already been added' });
    }
    // Create from an existing episode on TMDb or manually
    const isTmdbShow = miniEpisode && !miniEpisode.isManuallyAdded;
    const episodeDocument = isTmdbShow ? await mediaService.createEpisodeDocument(media.tmdbId, season, episode, override) : mediaService.createNewEpisodeDocument(episode, override);
    if (!episodeDocument.isManuallyAdded) {
      mediaService.updateTvEpisode(episodeDocument, override);
    }
    episodeDocument.stream = await mediaService.importStream(streamPath);
    episodeDocument.isPublic = isPublic;
    // Overwrite for existing episodes or push for new ones
    if (miniEpisode) {
      miniEpisode.set(episodeDocument);
    } else {
      media.tvShow.seasons[season].episodes.push(episodeDocument);
      media.tvShow.seasons[season].episodeCount++;
    }
    await media.save();
    res.status(200).send({ message: 'Episode has been added successfully' });
  } catch (e) {
    next(e);
  }
}

exports.updateMovie = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const { mediaId, streamPath, isPublic, override } = req.body;
  try {
    const media = await mediaService.findMediaById(mediaId);
    if (!media?.movie) {
      return res.status(404).send({ error: 'Movie not found' });
    }
    mediaService.updateMovie(media, override);
    media.movie.stream = await mediaService.importStream(streamPath);
    media.isPublic = isPublic;
    media.addedBy = req.currentUser._id;
    const result = await media.save();
    res.status(200).send({ id: result._id, message: 'Movie has been updated successfully' });
  } catch (e) {
    next(e);
  }
}

exports.updateTv = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const { mediaId, isPublic, override } = req.body;
  try {
    const media = await mediaService.findMediaById(mediaId);
    if (!media?.tvShow) {
      return res.status(404).send({ error: 'TV Show not found' });
    }
    mediaService.updateTv(media, override);
    media.isPublic = isPublic;
    media.addedBy = req.currentUser._id;
    const result = await media.save();
    res.status(200).send({ id: result._id, message: 'TV Show has been updated successfully' });
  } catch (e) {
    next(e);
  }
}

exports.updateTvSeason = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const { mediaId, season, isPublic, override } = req.body;
  try {
    const media = await mediaService.findMediaById(mediaId);
    const seasonDocument = mediaService.findTvSeason(media, season, true);
    if (!seasonDocument) {
      return res.status(404).send({ error: 'Season not found' });
    }
    mediaService.updateTvSeason(seasonDocument, override);
    seasonDocument.isPublic = isPublic;
    await media.save();
    res.status(200).send({ message: 'Season has been updated successfully' });
  } catch (e) {
    next(e);
  }
}

exports.updateTvEpisode = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const { mediaId, season, episode, streamPath, isPublic, override } = req.body;
  try {
    const media = await mediaService.findMediaById(mediaId);
    const seasonDocument = mediaService.findTvSeason(media, season);
    const episodeDocument = mediaService.findSeasonEpisode(seasonDocument, episode, true);
    if (!episodeDocument) {
      return res.status(404).send({ error: 'Episode not found' });
    }
    mediaService.updateTvEpisode(episodeDocument, override);
    episodeDocument.stream = await mediaService.importStream(streamPath);
    episodeDocument.isPublic = isPublic;
    await media.save();
    res.status(200).send({ message: 'Episode has been updated successfully' });
  } catch (e) {
    next(e);
  }
}

exports.deleteMovie = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const { mediaId } = req.body;
  try {
    const media = await mediaService.findMediaById(mediaId);
    if (!media?.movie) {
      return res.status(404).send({ error: 'Movie not found' });
    }
    if (media.isDeleted) {
      return res.status(422).send({ error: 'This show is not available' });
    }
    media.isDeleted = true;
    const result = await media.save();
    res.status(200).send({ id: result._id, message: 'Movie has been deleted successfully' });
  } catch (e) {
    next(e);
  }
}

exports.deleteTv = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const { mediaId } = req.body;
  try {
    const media = await mediaService.findMediaById(mediaId);
    if (!media?.tvShow) {
      return res.status(404).send({ error: 'TV Show not found' });
    }
    if (media.isDeleted) {
      return res.status(422).send({ error: 'This show is not available' });
    }
    media.isDeleted = true;
    const result = await media.save();
    res.status(200).send({ id: result._id, message: 'TV Show has been deleted successfully' });
  } catch (e) {
    next(e);
  }
}

exports.deleteTvSeason = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const { mediaId, season } = req.body;
  try {
    const media = await mediaService.findMediaById(mediaId);
    const seasonDocument = mediaService.findTvSeason(media, season, true);
    if (!seasonDocument) {
      return res.status(404).send({ error: 'Season not found' });
    }
    seasonDocument.isAdded = false;
    await media.save();
    res.status(200).send({ message: 'Season has been deleted successfully' });
  } catch (e) {
    next(e);
  }
}

exports.deleteTvEpisode = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const { mediaId, season, episode } = req.body;
  try {
    const media = await mediaService.findMediaById(mediaId);
    const seasonDocument = mediaService.findTvSeason(media, season);
    const episodeDocument = mediaService.findSeasonEpisode(seasonDocument, episode, true);
    if (!episodeDocument) {
      return res.status(404).send({ error: 'Episode not found' });
    }
    episodeDocument.isAdded = false;
    await media.save();
    res.status(200).send({ message: 'Episode has been deleted successfully' });
  } catch (e) {
    next(e);
  }
}