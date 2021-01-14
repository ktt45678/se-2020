const mediaService = require('../../services/media');

exports.index = (req, res) => {
  res.status(200).send({ message: 'Index' });
}

exports.view = (req, res) => {
  res.status(200).send({ message: 'View' });
}

exports.list = (req, res) => {
  res.status(200).send({ message: 'List' });
}

exports.search = (req, res) => {
  res.status(200).send({ message: 'Search' });
}

exports.stream = (req, res) => {
  res.status(200).send({ message: 'Stream' });
}

exports.addMovie = async (req, res, next) => {
  const { tmdbId, published } = req.body;
  try {
    const movieDocument = await mediaService.createMovieDocument(tmdbId);
    movieDocument.credits = await mediaService.importMovieCredits(tmdbId)
    movieDocument.published = published === 'true';
    movieDocument.addedBy = req.currentUser._id;
    const result = await movieDocument.save();
    res.status(200).send({ id: result._id, message: 'Movie has been added successfully' });
  } catch (e) {
    next(e);
  }
}

exports.addTv = async (req, res, next) => {
  const { tmdbId, published } = req.body;
  try {
    const tvDocument = await mediaService.createTvDocument(tmdbId);
    tvDocument.credits = await mediaService.importTvCredits(tmdbId);
    tvDocument.published = published === 'true';
    tvDocument.addedBy = req.currentUser._id;
    const result = await tvDocument.save();
    res.status(200).send({ id: result._id, message: 'TV Show has been added successfully' });
  } catch (e) {
    next(e);
  }
}

exports.addTvSeason = async (req, res, next) => {
  const { mediaId, season } = req.body;
  try {
    const media = await mediaService.findMediaById(mediaId);
    if (!media?.tvShow) {
      return res.status(404).send({ error: 'TV Show not found' });
    }
    const miniSeason = media.tvShow.seasons.find(s => s.seasonNumber === Number(season));
    if (!miniSeason) {
      return res.status(404).send({ error: 'Season not found' });
    }
    if (miniSeason.added) {
      return res.status(400).send({ error: 'This season has already been added' });
    }
    const seasonObject = await mediaService.createSeasonObject(media.tmdbId, season);
    seasonObject.added = true;
    miniSeason.set(seasonObject);
    await media.save();
    res.status(200).send({ message: 'Season has been added successfully' });
  } catch (e) {
    next(e);
  }
}

exports.addTvEpisode = async (req, res, next) => {
  const { mediaId, season, episode } = req.body;
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
    if (miniEpisode.added) {
      return res.status(400).send({ error: 'This episode has already been added' });
    }
    const episodeObject = await mediaService.createEpisodeObject(mediaId, season, episode);
    episodeObject.added = true;
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