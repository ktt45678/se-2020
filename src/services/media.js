const config = require('../../config.json').media;
const mediaModule = require('../modules/media');
const miscModule = require('../modules/misc');
const mediaModel = require('../models/media');
const creditModel = require('../models/credit');
const mediaStorageModel = require('../models/media-storage');
const tmdbService = require('./tmdb');
const driveService = require('./drive');

exports.createMovieDocument = async (id, override) => {
  const movieResponse = await tmdbService.movie(id);
  const movieVideoResponse = await tmdbService.movieVideos(id);
  const movieData = mediaModule.parseMovieData(movieResponse.data);
  const videoData = mediaModule.parseVideoData(movieVideoResponse.data);
  movieData.videos = videoData;
  const movie = new mediaModel(movieData);
  return movie;
}

exports.createTvDocument = async (id, override) => {
  const tvResponse = await tmdbService.tv(id);
  const tvVideoResponse = await tmdbService.tvVideos(id);
  const tvData = mediaModule.parseTvData(tvResponse.data);
  const videoData = mediaModule.parseVideoData(tvVideoResponse.data);
  tvData.videos = videoData;
  const tv = new mediaModel(tvData);
  return tv;
}

exports.createNewMovieDocument = (override) => {
  if (!override) {
    throw { status: 422, message: 'Override data is required to add a new movie' }
  }
  const newMovie = new mediaModel();
  newMovie.tagline = override.tagline ?? null;
  newMovie.title = override.title ?? null;
  newMovie.originalTitle = override.originalTitle ?? null;
  newMovie.overview = override.overview ?? null;
  newMovie.posterPath = override.posterPath ?? null;
  newMovie.backdropPath = override.backdropPath ?? null;
  newMovie.movie = {};
  newMovie.movie.runtime = override.movie?.runtime ?? null;
  newMovie.movie.releaseDate = override.movie?.releaseDate ?? null;
  newMovie.movie.status = override.movie?.status ?? null;
  newMovie.movie.adult = override.movie?.adult ?? null;
  newMovie.genres = override.genres ?? null;
  newMovie.popularity = override.popularity ?? null;
  newMovie.isManuallyAdded = true;
  return newMovie;
}

exports.createNewTvDocument = (override) => {
  if (!override) {
    throw { status: 422, message: 'Override data is required to add a new tv show' }
  }
  const newTv = new mediaModel();
  newTv.tagline = override.tagline ?? null;
  newTv.title = override.title ?? null;
  newTv.originalTitle = override.originalTitle ?? null;
  newTv.overview = override.overview ?? null;
  newTv.posterPath = override.posterPath ?? null;
  newTv.backdropPath = override.backdropPath ?? null;
  newTv.tvShow = {};
  newTv.tvShow.episodeRuntime = override.tvShow?.episodeRuntime ?? null;
  newTv.tvShow.firstAirDate = override.tvShow?.firstAirDate ?? null;
  newTv.tvShow.lastAirDate = override.tvShow?.lastAirDate ?? null;
  newTv.tvShow.status = override.tvShow?.status ?? null;
  newTv.tvShow.seasonCount = override.tvShow?.seasonCount ?? null;
  newTv.tvShow.seasons = [];
  newTv.genres = override.genres ?? null;
  newTv.popularity = override.popularity ?? null;
  newTv.isManuallyAdded = true;
  return newTv;
}

exports.importMovieCredits = async (id) => {
  const credits = [];
  const movieCreditResponse = await tmdbService.movieCredits(id);
  const creditData = mediaModule.parseCreditData(movieCreditResponse.data);
  for (let i = 0; i < creditData.length; i++) {
    const credit = await creditModel.findByTmdbId(creditData[i].tmdbId);
    if (credit) {
      credits.push(credit._id);
    } else {
      const newCreditDocument = new creditModel(creditData[i]);
      const newCredit = await newCreditDocument.save();
      credits.push(newCredit._id);
    }
  }
  return credits;
}

exports.importTvCredits = async (id) => {
  const credits = [];
  const tvCreditResponse = await tmdbService.tvCredits(id);
  const creditData = mediaModule.parseCreditData(tvCreditResponse.data);
  for (let i = 0; i < creditData.length; i++) {
    const credit = await creditModel.findByTmdbId(creditData[i].tmdbId);
    if (credit) {
      credits.push(credit._id);
    } else {
      const newCreditDocument = new creditModel(creditData[i]);
      const newCredit = await newCreditDocument.save();
      credits.push(newCredit._id);
    }
  }
  return credits;
}

exports.importStream = async (path_) => {
  const path = path_.endsWith('/') ? path_ : `${path_}/`;
  const streamResponse = await driveService.getDirectories(path);
  const streamData = driveService.parseFiles(path, streamResponse.data);
  if (!streamData.mimeType) {
    throw { status: 404, message: 'Could not find any video stream on this path' }
  }
  const stream = await mediaStorageModel.findByPath(path);
  if (stream) {
    return stream._id;
  }
  const streamDocument = new mediaStorageModel(streamData);
  const newStream = await streamDocument.save();
  return newStream._id;
}

exports.createSeasonDocument = async (id, season, override) => {
  const tvSeasonResponse = await tmdbService.tvSeason(id, season);
  const tvSeasonData = mediaModule.parseSeasonData(tvSeasonResponse.data);
  tvSeasonData.isAdded = true;
  return tvSeasonData;
}

exports.createEpisodeDocument = async (id, season, episode, override) => {
  const tvEpisodeResponse = await tmdbService.tvEpisode(id, season, episode);
  const tvEpisodeData = mediaModule.parseEpisodeData(tvEpisodeResponse.data);
  tvEpisodeData.isAdded = true;
  return tvEpisodeData;
}

exports.createNewSeasonDocument = (season, override) => {
  if (!override) {
    throw { status: 422, message: 'Override data is required to add a new season' }
  }
  const tvSeasonData = {};
  tvSeasonData.seasonNumber = season;
  tvSeasonData.airDate = override.airDate ?? null;
  tvSeasonData.episodeCount = override.episodeCount ?? null;
  tvSeasonData.name = override.name ?? null;
  tvSeasonData.overview = override.overview ?? null;
  tvSeasonData.posterPath = override.posterPath ?? null;
  tvSeasonData.episodes = [];
  tvSeasonData.isAdded = true;
  tvSeasonData.isManuallyAdded = true;
  return tvSeasonData;
}

exports.createNewEpisodeDocument = (episode, override) => {
  if (!override) {
    throw { status: 422, message: 'Override data is required to add a new episode' }
  }
  const tvEpisodeData = {};
  tvEpisodeData.episodeNumber = episode;
  tvEpisodeData.runtime = override.runtime ?? null;
  tvEpisodeData.name = override.name ?? null;
  tvEpisodeData.overview = override.overview ?? null;
  tvEpisodeData.airDate = override.airDate ?? null;
  tvEpisodeData.stillPath = override.stillPath ?? null;
  tvEpisodeData.isAdded = true;
  tvEpisodeData.isManuallyAdded = true;
  return tvEpisodeData;
}

exports.updateMovie = (media, override) => {
  // Override media and its nested property
  miscModule.overrideData(media, override, config.readonly_fields);
  miscModule.overrideData(media.movie, override?.movie, config.readonly_fields);
}

exports.updateTv = (media, override) => {
  miscModule.overrideData(media, override, config.readonly_fields);
  miscModule.overrideData(media.tvShow, override?.tvShow, config.readonly_fields);
}

exports.updateTvSeason = (season, override) => {
  miscModule.overrideData(season, override, config.readonly_fields);
}

exports.updateTvEpisode = (episode, override) => {
  miscModule.overrideData(episode, override, config.readonly_fields);
}

exports.findMediaById = async (id) => {
  return await mediaModel.findById(id);
}

exports.findMediaDetailsById = async (id, isPublic, exclusions) => {
  const fields = miscModule.toExclusionQuery(exclusions);
  const result_ = await mediaModel.findMediaDetailsById(id, isPublic, fields);
  if (!result_) {
    throw { status: 404, message: 'The resource could not be found' }
  }
  // Process images
  const posterUrl = `${process.env.IMAGECDN_URL}${config.poster_url}`;
  const backdropUrl = `${process.env.IMAGECDN_URL}${config.backdrop_url}`;
  const profileUrl = `${process.env.IMAGECDN_URL}${config.profile_url}`;
  const stillUrl = `${process.env.IMAGECDN_URL}${config.still_url}`;
  const result = mediaModule.parseMediaResult(posterUrl, backdropUrl, result_);
  if (result.credits) {
    result.credits = mediaModule.parseCreditResult(profileUrl, result.credits);
  }
  if (result.tvShow) {
    result.tvShow.seasons = mediaModule.parseTvSeasonResult(posterUrl, stillUrl, result.tvShow.seasons);
  }
  return result;
}

exports.findTvSeason = (media, season, isAdded = null) => {
  if (!media?.tvShow) {
    throw { status: 404, message: 'TV Show not found' }
  }
  if (typeof isAdded === 'boolean') {
    return media.tvShow.seasons.find(s => s.seasonNumber === season && s.isAdded === isAdded);
  }
  return media.tvShow.seasons.find(s => s.seasonNumber === season);
}

exports.findSeasonEpisode = (season, episode, isAdded = null) => {
  if (!season) {
    throw { status: 404, message: 'Season not found' }
  }
  if (!season.isAdded) {
    throw { status: 422, message: 'This season is not available' }
  }
  if (typeof isAdded === 'boolean') {
    return season.episodes.find(e => e.episodeNumber === episode && e.isAdded === isAdded);
  }
  return season.episodes.find(e => e.episodeNumber === episode);
}

exports.fetchMedia = async (query, type, genre, sortString, isPublic, page, limit) => {
  const sort = miscModule.toSortQuery(sortString);
  const skip = miscModule.calculatePageSkip(page, limit);
  const results = await mediaModel.fetchMedia(query, type, genre, sort, isPublic, skip, limit);
  // Aggregation always returns an array, result is the first one
  const result = results.shift();
  if (result) {
    const posterUrl = `${process.env.IMAGECDN_URL}${config.poster_url}`;
    const backdropUrl = `${process.env.IMAGECDN_URL}${config.backdrop_url}`;
    for (let i = 0; i < result.results.length; i++) {
      result.results[i] = mediaModule.parseMediaResult(posterUrl, backdropUrl, result.results[i]);
    }
    result.page = page;
    return result;
  }
  return { totalResults: 0, results: [], page };
}

exports.findStreamByMedia = async (media, seasonNumber, episodeNumber) => {
  // Media -> Movie -> Stream
  // Media -> Tv Show -> Season -> Episode -> Stream
  if (media.movie?.stream) {
    return media.movie.stream;
  } else if (media.tvShow?.seasons) {
    const season = this.findTvSeason(media, seasonNumber, true);
    const episode = this.findSeasonEpisode(season, episodeNumber, true);
    if (episode?.stream) {
      return episode.stream;
    }
  }
  throw { status: 404, message: 'The resource could not be found' }
}

exports.createStreamUrls = async (id) => {
  const baseUrl = process.env.GDRIVE_URL;
  const stream = await mediaStorageModel.findById(id);
  if (!stream) {
    throw { status: 404, message: 'The resource could not be found' }
  }
  const urls = mediaModule.createStreamUrls(baseUrl, stream);
  return urls;
}