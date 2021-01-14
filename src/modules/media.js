const config = require('../../config.json').tmdb;

exports.parseMovieData = (data) => {
  const { adult, backdrop_path, genres, id, imdb_id, original_title, overview, popularity, poster_path, release_date, runtime, tagline, title, status } = data;
  const miniData = {
    tmdbId: id,
    imdbId: imdb_id,
    tagline: tagline,
    title: title,
    originalTitle: original_title,
    overview: overview,
    posterPath: poster_path,
    backdropPath: backdrop_path,
    genres: [],
    popularity: popularity,
    movie: {
      runtime: runtime,
      releaseDate: release_date,
      status: status,
      adult: adult
    }
  }
  for (let i = 0; i < genres.length; i++) {
    miniData.genres.push(genres[i].name);
  }
  return miniData;
}

exports.parseTvData = (data) => {
  const { backdrop_path, genres, id, original_name, overview, popularity, poster_path, first_air_date, last_air_date, episode_run_time, number_of_seasons, seasons, status, tagline, name } = data;
  const miniData = {
    tmdbId: id,
    tagline: tagline,
    title: name,
    originalTitle: original_name,
    overview: overview,
    posterPath: poster_path,
    backdropPath: backdrop_path,
    genres: [],
    popularity: popularity,
    tvShow: {
      episodeRuntime: episode_run_time,
      firstAirDate: first_air_date,
      lastAirDate: last_air_date,
      status: status,
      seasonCount: number_of_seasons,
      seasons: []
    }
  }
  for (let i = 0; i < genres.length; i++) {
    miniData.genres.push(genres[i].name);
  }
  for (let i = 0; i < seasons.length; i++) {
    const { air_date, season_number } = seasons[i];
    miniData.tvShow.seasons.push({ airDate: air_date, seasonNumber: season_number });
  }
  return miniData;
}

exports.parseSeasonData = (data) => {
  const { air_date, season_number, episode_count, episodes, name, overview, poster_path } = data;
  const miniData = {
    airDate: air_date,
    seasonNumber: season_number,
    episodeCount: episode_count,
    episodes: [],
    name: name,
    overview: overview,
    posterPath: poster_path
  }
  for (let i = 0; i < episodes.length; i++) {
    const { air_date, episode_number } = episodes[i];
    miniData.episodes.push({ airDate: air_date, episodeNumber: episode_number });
  }
  return miniData;
}

exports.parseEpisodeData = (data) => {
  const { episode_number, runtime, name, overview, air_date, still_path } = data;
  const miniData = {
    episodeNumber: episode_number,
    runtime: runtime,
    name: name,
    overview: overview,
    airDate: air_date,
    stillPath: still_path
  }
  return miniData;
}

exports.parseCreditData = (data) => {
  const { credit_limit } = config;
  const castLimit = data.cast.length > credit_limit ? credit_limit : data.cast.length;
  const crewLimit = data.crew.length > credit_limit ? credit_limit : data.crew.length;
  const miniData = [];
  for (let i = 0; i < castLimit; i++) {
    const { name, original_name, profile_path, known_for_department, character } = data.cast[i];
    miniData.push({
      name: name,
      originalName: original_name,
      profilePath: profile_path,
      department: known_for_department,
      cast: { character }
    });
  }
  for (let i = 0; i < crewLimit; i++) {
    const { name, original_name, profile_path, department, job } = data.crew[i];
    miniData.push({
      name: name,
      originalName: original_name,
      profilePath: profile_path,
      department: department,
      crew: { job }
    });
  }
  return miniData;
}

exports.parseVideoData = (data) => {
  const miniData = [];
  for (let i = 0; i < data.results.length; i++) {
    const { name, site, key, type } = data.results[i];
    miniData.push({ name, site, key, type });
  }
  return miniData;
}