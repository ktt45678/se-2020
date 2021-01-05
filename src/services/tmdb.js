const config = require('../../config.json').tmdb;
const request = require('../modules/request');
const tmdbModule = require('../modules/tmdb');

const headers = { Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}` }
const url = process.env.TMDB_API_URL;

exports.search = async (type, query, page, include_adult) => {
  const params = { query, page, include_adult }
  return await request.get(`${url}/search/${type}`, { headers, params });
}

exports.movie = async (id) => {
  return await request.get(`${url}/movie/${id}`, { headers });
}

exports.movieCredits = async (id) => {
  return await request.get(`${url}/movie/${id}/credits`, { headers });
}

exports.movieImages = async (id) => {
  return await request.get(`${url}/movie/${id}/images`, { headers });
}

exports.movieVideos = async (id) => {
  return await request.get(`${url}/movie/${id}/videos`, { headers });
}

exports.tv = async (id) => {
  return await request.get(`${url}/tv/${id}`, { headers });
}

exports.tvSeason = async (id, season) => {
  return await request.get(`${url}/tv/${id}/season/${season}`, { headers });
}

exports.tvEpisode = async (id, season, episode) => {
  return await request.get(`${url}/tv/${id}/season/${season}/episode/${episode}`, { headers });
}

exports.tvCredits = async (id) => {
  return await request.get(`${url}/tv/${id}/credits`, { headers });
}

exports.tvImages = async (id) => {
  return await request.get(`${url}/tv/${id}/images`, { headers });
}

exports.tvVideos = async (id) => {
  return await request.get(`${url}/tv/${id}/videos`, { headers });
}

exports.parseMovieSearch = (data) => {
  const { poster_url } = config;
  return tmdbModule.parseMovieSearch(data, poster_url);
}

exports.parseTvSearch = (data) => {
  const { poster_url } = config;
  return tmdbModule.parseTvSearch(data, poster_url);
}

exports.parseMovieData = (data) => {
  const { backdrop_url, poster_url } = config;
  return tmdbModule.parseMovieData(data, backdrop_url, poster_url);
}

exports.parseTvData = (data) => {
  const { backdrop_url, poster_url } = config;
  return tmdbModule.parseTvData(data, backdrop_url, poster_url);
}

exports.parseSeasonData = (data) => {
  const { poster_url } = config;
  return tmdbModule.parseSeasonData(data, poster_url);
}

exports.parseEpisodeData = (data) => {
  const { still_url } = config;
  return tmdbModule.parseEpisodeData(data, still_url);
}

exports.parseImageData = (data) => {
  const { backdrop_url, poster_url } = config;
  return tmdbModule.parseImageData(data, backdrop_url, poster_url);
}

exports.parseVideoData = (data) => {
  return tmdbModule.parseVideoData(data);
}

exports.parseCreditData = (data) => {
  return tmdbModule.parseCreditData(data);
}