exports.parseMovieSearch = (data, poster_url = '') => {
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
      tmdbId: id,
      originalTitle: original_title,
      overview: overview,
      popularity: popularity,
      posterPath: poster_path ? poster_url + poster_path : null,
      releaseDate: release_date,
      title: title
    });
  }
  return miniData;
}

exports.parseTvSearch = (data, poster_url = '') => {
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
      tmdbId: id,
      originalTitle: original_name,
      overview: overview,
      popularity: popularity,
      posterPath: poster_path ? poster_url + poster_path : null,
      firstAirDate: first_air_date,
      title: name
    });
  }
  return miniData;
}

exports.parseMovieData = (data, backdrop_url = '', poster_url = '') => {
  const { adult, backdrop_path, genres, id, imdb_id, original_title, overview, popularity, poster_path, release_date, runtime, tagline, title, status } = data;
  const miniData = {
    adult: adult,
    backdropPath: backdrop_path ? backdrop_url + backdrop_path : null,
    genres: [],
    tmdbId: id,
    imdbId: imdb_id,
    originalTitle: original_title,
    overview: overview,
    popularity: popularity,
    posterPath: poster_path ? poster_url + poster_path : null,
    releaseDate: release_date,
    runtime: runtime,
    tagline: tagline,
    title: title,
    status: status
  }
  for (let i = 0; i < genres.length; i++) {
    miniData.genres.push(genres[i].name);
  }
  return miniData;
}

exports.parseTvData = (data, backdrop_url = '', poster_url = '') => {
  const { backdrop_path, genres, id, original_name, overview, popularity, poster_path, first_air_date, last_air_date, episode_run_time, number_of_seasons, seasons, status, tagline, name } = data;
  const miniData = {
    backdropPath: backdrop_path ? backdrop_url + backdrop_path : null,
    genres: [],
    tmdbId: id,
    originalTitle: original_name,
    overview: overview,
    popularity: popularity,
    posterPath: poster_path ? poster_url + poster_path : null,
    firstAirDate: first_air_date,
    lastAirDate: last_air_date,
    episodeRunTime: episode_run_time,
    seasonCount: number_of_seasons,
    seasons: [],
    status: status,
    tagline: tagline,
    title: name
  }
  for (let i = 0; i < genres.length; i++) {
    miniData.genres.push(genres[i].name);
  }
  for (let i = 0; i < seasons.length; i++) {
    const { air_date, season_number, episode_count, name, overview, poster_path } = seasons[i];
    miniData.seasons.push({
      airDate: air_date,
      seasonNumber: season_number,
      episodeCount: episode_count,
      name: name,
      overview: overview,
      posterPath: poster_path ? poster_url + poster_path : null
    });
  }
  return miniData;
}

exports.parseSeasonData = (data, poster_url = '') => {
  const { air_date, season_number, episode_count, episodes, name, overview, poster_path } = data;
  const miniData = {
    airDate: air_date,
    seasonNumber: season_number,
    episodeCount: episode_count,
    episodes: [],
    name: name,
    overview: overview,
    posterPath: poster_path ? poster_url + poster_path : null
  }
  for (let i = 0; i < episodes.length; i++) {
    const { air_date, episode_number } = episodes[i];
    miniData.episodes.push({ airDate: air_date, episodeNumber: episode_number });
  }
  return miniData;
}

exports.parseEpisodeData = (data, still_url = '') => {
  const { season_number, episode_number, runtime, name, overview, air_date, still_path } = data;
  const miniData = {
    seasonNumber: season_number,
    episodeNumber: episode_number,
    runtime: runtime,
    name: name,
    overview: overview,
    airDate: air_date,
    stillPath: still_path ? still_url + still_path : null
  }
  return miniData;
}

exports.parseImageData = (data, backdrop_url = '', poster_url = '') => {
  const { id, backdrops, posters } = data;
  const miniData = {
    id,
    posters: [],
    backdrops: []
  }
  for (let i = 0; i < backdrops.length; i++) {
    const backdrop_path = backdrops[i].file_path;
    miniData.backdrops.push(backdrop_url + backdrop_path);
  }
  for (let i = 0; i < posters.length; i++) {
    const poster_path = posters[i].file_path;
    miniData.posters.push(poster_url + poster_path);
  }
  return miniData;
}

exports.parseVideoData = (data) => {
  const { video_limit } = config;
  const videoLimit = data.results.length > video_limit ? video_limit : data.results.length;
  const miniData = {
    tmdbId: data.id,
    results: []
  }
  for (let i = 0; i < videoLimit; i++) {
    const { name, site, key, type } = data.results[i];
    miniData.results.push({ name, site, key, type });
  }
  return miniData;
}

exports.parseCreditData = (data, profile_url = '') => {
  const { credit_limit } = config;
  const castLimit = data.cast.length > credit_limit ? credit_limit : data.cast.length;
  const crewLimit = data.crew.length > credit_limit ? credit_limit : data.crew.length;
  const miniData = {
    tmdbId: data.id,
    cast: [],
    crew: []
  }
  for (let i = 0; i < castLimit; i++) {
    const { name, original_name, profile_path, known_for_department, character } = data.cast[i];
    miniData.cast.push({
      name: name,
      originalName: original_name,
      profilePath: profile_path ? profile_url + profile_path : null,
      department: known_for_department,
      character: character
    });
  }
  for (let i = 0; i < crewLimit; i++) {
    const { name, original_name, profile_path, department, job } = data.crew[i];
    miniData.crew.push({
      name: name,
      originalName: original_name,
      profilePath: profile_path ? profile_url + profile_path : null,
      department: department,
      job: job
    });
  }
  return miniData;
}