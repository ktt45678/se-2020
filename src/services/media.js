const mediaModule = require('../modules/media');
const mediaModel = require('../models/media');
const creditModel = require('../models/credit');
const tmdbService = require('../services/tmdb');

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
    const credit = await creditModel.findByCredit(creditData[i]);
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
    const credit = await creditModel.findByCredit(creditData[i]);
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

exports.updateTvSeason = (tvDocument, seasonObject) => {
  const season = tvDocument.tvShow.seasons.find(s => s.seasonNumber === seasonObject.seasonNumber);
  season.set(seasonObject);
}