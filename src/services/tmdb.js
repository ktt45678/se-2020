const config = require('../../config.json').tmdb;
const request = require('../modules/request');

const headers = { Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}` };
const url = process.env.TMDB_API_URL;

exports.search = async (type, query, page, include_adult) => {
  const params = { query, page, include_adult };
  return await request.get(`${url}/search/${type}`, { headers, params });
}

exports.parseMovieSearch = (data) => {
  const miniData = {
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
    results: []
  };
  data.results.forEach(result => {
    miniData.results.push({
      adult: result.adult,
      id: result.id,
      originalTitle: result.original_title,
      overview: result.overview,
      popularity: result.popularity,
      posterPath: `${config.poster_url}${result.poster_path}`,
      releaseDate: result.release_date,
      title: result.title
    });
  });
  return miniData;
}

exports.parseTvSearch = (data) => {
  const miniData = {
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
    results: []
  };
  data.results.forEach(result => {
    miniData.results.push({
      id: result.id,
      originalTitle: result.original_name,
      overview: result.overview,
      popularity: result.popularity,
      posterPath: `${config.poster_url}${result.poster_path}`,
      firstAirDate: result.first_air_date,
      title: result.name
    });
  });
  return miniData;
}

exports.movie = async (id) => {
  return await request.get(`${url}/movie/${id}`, { headers });
}

exports.parseMovieData = (data) => {
  const miniData = {
    adult: data.adult,
    backdropPath: `${config.backdrop_url}${data.backdrop_path}`,
    genres: data.genres.map(g => g.name),
    id: data.id,
    imdbId: data.imdb_id,
    originalTitle: data.original_title,
    overview: data.overview,
    popularity: data.popularity,
    posterPath: `${config.poster_url}${data.poster_path}`,
    productionCompanies: data.production_companies.map(c => c.name),
    releaseDate: data.release_date,
    runtime: data.runtime,
    tagline: data.tagline,
    title: data.title
  };
  return miniData;
}

exports.tv = async (id) => {
  return await request.get(`${url}/tv/${id}`, { headers });
}

exports.parseTvData = (data) => {
  const miniData = {
    backdropPath: `${config.backdrop_url}${data.backdrop_path}`,
    genres: data.genres.map(g => g.name),
    id: data.id,
    originalTitle: data.original_name,
    overview: data.overview,
    popularity: data.popularity,
    posterPath: `${config.poster_url}${data.poster_path}`,
    productionCompanies: data.production_companies.map(c => c.name),
    firstAirDate: data.first_air_date,
    episodeRunTime: data.episode_run_time,
    tagline: data.tagline,
    title: data.name
  };
  return miniData;
}