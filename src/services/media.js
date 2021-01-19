const mediaModule = require('../modules/media');
const miscModule = require('../modules/misc');
const mediaModel = require('../models/media');
const creditModel = require('../models/credit');
const mediaStorageModel = require('../models/media-storage');
const tmdbService = require('./tmdb');
const driveService = require('./drive');

exports.createMovieDocument = async (id) => {
  const movieResponse = await tmdbService.movie(id);
  const movieVideoResponse = await tmdbService.movieVideos(id);
  const movieData = mediaModule.parseMovieData(movieResponse.data);
  const videoData = mediaModule.parseVideoData(movieVideoResponse.data);
  movieData.videos = videoData;
  const movie = new mediaModel(movieData);
  return movie;
}

exports.createTvDocument = async (id) => {
  const tvResponse = await tmdbService.tv(id);
  const tvVideoResponse = await tmdbService.tvVideos(id);
  const tvData = mediaModule.parseTvData(tvResponse.data);
  const videoData = mediaModule.parseVideoData(tvVideoResponse.data);
  tvData.videos = videoData;
  const tv = new mediaModel(tvData);
  return tv;
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

exports.createSeasonObject = async (id, season) => {
  const tvSeasonResponse = await tmdbService.tvSeason(id, season);
  const tvSeasonData = mediaModule.parseSeasonData(tvSeasonResponse.data);
  return tvSeasonData;
}

exports.createEpisodeObject = async (id, season, episode) => {
  const tvEpisodeResponse = await tmdbService.tvEpisode(id, season, episode);
  const tvEpisodeData = mediaModule.parseEpisodeData(tvEpisodeResponse.data);
  return tvEpisodeData;
}

exports.findMediaById = async (id, exclude_) => {
  exclude = exclude_ ? miscModule.toExclusionString(exclude_) : '';
  const result_ = await mediaModel.findMediaDetailsById(id, exclude);
  const result = mediaModule.parseMediaResult(result_);
  if (result.credits) {
    result.credits = mediaModule.parseCreditResult(result.credits);
  }
  if (result.tvShow) {
    result.tvShow.seasons = mediaModule.parseTvSeasonResult(result.tvShow.seasons);
  }
  return result;
}

exports.searchMedia = async (query, type, genre, sortString, isPublic, page_, limit_) => {
  const page = page_ ? Number(page_) : 1;
  const limit = limit_ ? Number(limit_) : 30;
  const sort = sortString ? miscModule.toSortQuery(sortString) : null;
  const skip = miscModule.calculatePageSkip(page, limit);
  const results = await mediaModel.searchMedia(query, type, genre, sort, isPublic, skip, limit);
  for (let i = 0; i < results.length; i++) {
    results[i] = mediaModule.parseMediaResult(results[i]);
  }
  const media = { page, results }
  return media;
}

exports.fetchMedia = async (type, genre, sortString, isPublic, page_, limit_) => {
  const page = page_ ? Number(page_) : 1;
  const limit = limit_ ? Number(limit_) : 30;
  const sort = sortString ? miscModule.toSortQuery(sortString) : null;
  const skip = miscModule.calculatePageSkip(page, limit);
  const results = await mediaModel.fetchMedia(type, genre, sort, isPublic, skip, limit);
  for (let i = 0; i < results.length; i++) {
    results[i] = mediaModule.parseMediaResult(results[i]);
  }
  const media = { page, results }
  return media;
}

exports.updateTvSeason = (tvDocument, seasonObject) => {
  const season = tvDocument.tvShow.seasons.find(s => s.seasonNumber === seasonObject.seasonNumber);
  season.set(seasonObject);
}