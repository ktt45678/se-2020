const config = require('../../config.json').tmdb;
const request = require('../modules/request');

const headers = { Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}` }
const url = process.env.TMDB_API_URL;

exports.search = async (type, query, page, include_adult) => {
  const params = { query, page, include_adult }
  return await request.get(`${url}/search/${type}`, { headers, params });
}

exports.parseMovieSearch = (data) => {
  const { page, total_pages, total_results, results } = data;
  const miniData = {
    page: page,
    totalPages: total_pages,
    totalResults: total_results,
    results: []
  }
  for (let i = 0; i < results.length; i++) {
    const { adult, id, original_title, overview, popularity, poster_path, release_date, title } = results[i];
    miniData.results.push({
      adult: adult,
      id: id,
      originalTitle: original_title,
      overview: overview,
      popularity: popularity,
      posterPath: `${config.poster_url}${poster_path}`,
      releaseDate: release_date,
      title: title
    });
  }
  return miniData;
}

exports.parseTvSearch = (data) => {
  const { page, total_pages, total_results, results } = data;
  const miniData = {
    page: page,
    totalPages: total_pages,
    totalResults: total_results,
    results: []
  }
  for (let i = 0; i < results.length; i++) {
    const { id, original_name, overview, popularity, poster_path, first_air_date, name } = results[i];
    miniData.results.push({
      id: id,
      originalTitle: original_name,
      overview: overview,
      popularity: popularity,
      posterPath: `${config.poster_url}${poster_path}`,
      firstAirDate: first_air_date,
      title: name
    });
  }
  return miniData;
}

exports.movie = async (id) => {
  return await request.get(`${url}/movie/${id}`, { headers });
}

exports.parseMovieData = (data) => {
  const { adult, backdrop_path, genres, id, imdb_id, original_title, overview, popularity, poster_path, production_companies, release_date, runtime, tagline, title } = data;
  const miniData = {
    adult: adult,
    backdropPath: `${config.backdrop_url}${backdrop_path}`,
    genres: genres.map(g => g.name),
    id: id,
    imdbId: imdb_id,
    originalTitle: original_title,
    overview: overview,
    popularity: popularity,
    posterPath: `${config.poster_url}${poster_path}`,
    productionCompanies: production_companies.map(c => c.name),
    releaseDate: release_date,
    runtime: runtime,
    tagline: tagline,
    title: title
  }
  return miniData;
}

exports.tv = async (id) => {
  return await request.get(`${url}/tv/${id}`, { headers });
}

exports.parseTvData = (data) => {
  const { backdrop_path, genres, id, original_name, overview, popularity, poster_path, production_companies, first_air_date, episode_run_time, tagline, name } = data;
  const miniData = {
    backdropPath: `${config.backdrop_url}${backdrop_path}`,
    genres: genres.map(g => g.name),
    id: id,
    originalTitle: original_name,
    overview: overview,
    popularity: popularity,
    posterPath: `${config.poster_url}${poster_path}`,
    productionCompanies: production_companies.map(c => c.name),
    firstAirDate: first_air_date,
    episodeRunTime: episode_run_time,
    tagline: tagline,
    title: name
  }
  return miniData;
}