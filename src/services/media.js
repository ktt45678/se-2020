const config = require('../../config.json').tmdb;
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

exports.findMediaById = async (id) => {
  return await mediaModel.findById(id);
}

exports.findMediaDetailsById = async (id, isPublic, exclude_) => {
  exclude = exclude_ ? miscModule.toExclusionString(exclude_) : '';
  const result_ = await mediaModel.findMediaDetailsById(id, isPublic, exclude);
  if (!result_) {
    throw { status: 404, message: 'The resource could not be found' }
  }
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

exports.fetchMedia = async (query, type, genre, sortString, isPublic, page_, limit_) => {
  const page = page_ ? Number(page_) : 1;
  const limit = limit_ ? Number(limit_) : 30;
  const sort = sortString ? miscModule.toSortQuery(sortString) : null;
  const skip = miscModule.calculatePageSkip(page, limit);
  const results = await mediaModel.fetchMedia(query, type, genre, sort, isPublic, skip, limit);
  if (results[0]) {
    const posterUrl = `${process.env.IMAGECDN_URL}${config.poster_url}`;
    const backdropUrl = `${process.env.IMAGECDN_URL}${config.backdrop_url}`;
    for (let i = 0; i < results[0].results.length; i++) {
      results[0].results[i] = mediaModule.parseMediaResult(posterUrl, backdropUrl, results[0].results[i]);
    }
    results[0].page = page;
  } else {
    results.push({ totalResults: 0, results: [], page });
  }
  return results[0];
}

exports.findStreamByMedia = async (media, seasonNumber, episodeNumber) => {
  if (media.movie?.stream) {
    return media.movie.stream;
  } else if (media.tvShow?.seasons) {
    const season = media.tvShow.seasons.find(s => s.seasonNumber === Number(seasonNumber));
    if (season?.episodes) {
      const episode = season.episodes.find(e => e.episodeNumber === Number(episodeNumber));
      if (episode?.stream) {
        return episode.stream;
      }
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

exports.updateTvSeason = (tvDocument, seasonObject) => {
  const season = tvDocument.tvShow.seasons.find(s => s.seasonNumber === seasonObject.seasonNumber);
  season.set(seasonObject);
}