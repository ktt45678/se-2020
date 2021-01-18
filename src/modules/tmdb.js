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
      poster: {
        path: poster_path,
        url: poster_path ? poster_url + poster_path : poster_path
      },
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
      poster: {
        path: poster_path,
        url: poster_path ? poster_url + poster_path : poster_path
      },
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
    backdrop: {
      path: backdrop_path,
      url: backdrop_url + backdrop_path
    },
    genres: [],
    tmdbId: id,
    imdbId: imdb_id,
    originalTitle: original_title,
    overview: overview,
    popularity: popularity,
    poster: {
      path: poster_path,
      url: poster_path ? poster_url + poster_path : poster_path
    },
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
    backdrop: {
      path: backdrop_path,
      url: backdrop_path ? backdrop_url + backdrop_path : backdrop_path
    },
    genres: [],
    tmdbId: id,
    originalTitle: original_name,
    overview: overview,
    popularity: popularity,
    poster: {
      path: poster_path,
      url: poster_path ? poster_url + poster_path : poster_path
    },
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
      poster: {
        path: poster_path,
        url: poster_path ? poster_url + poster_path : poster_path
      }
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
    poster: {
      path: poster_path,
      url: poster_path ? poster_url + poster_path : poster_path
    }
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
    still: {
      path: still_path,
      url: still_path ? still_url + still_path : still_path
    }
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
    miniData.backdrops.push({
      path: backdrop_path,
      url: backdrop_url + backdrop_path
    });
  }
  for (let i = 0; i < posters.length; i++) {
    const poster_path = posters[i].file_path;
    miniData.posters.push({
      path: poster_path,
      url: poster_url + poster_path
    });
  }
  return miniData;
}

exports.parseVideoData = (data) => {
  const miniData = {
    tmdbId: data.id,
    results: []
  }
  for (let i = 0; i < data.results.length; i++) {
    const { name, site, key, type } = data.results[i];
    miniData.results.push({ name, site, key, type });
  }
  return miniData;
}

exports.parseCreditData = (data, profile_url = '') => {
  const miniData = {
    tmdbId: data.id,
    cast: [],
    crew: []
  }
  for (let i = 0; i < data.cast.length; i++) {
    const { name, original_name, profile_path, known_for_department, character } = data.cast[i];
    miniData.cast.push({
      name: name,
      originalName: original_name,
      profile: {
        path: profile_path,
        url: profile_path ? profile_url + profile_path : profile_path
      },
      department: known_for_department,
      character: character
    });
  }
  for (let i = 0; i < data.crew.length; i++) {
    const { name, original_name, profile_path, department, job } = data.crew[i];
    miniData.crew.push({
      name: name,
      originalName: original_name,
      profile: {
        path: profile_path,
        url: profile_path ? profile_url + profile_path : profile_path
      },
      department: department,
      job: job
    });
  }
  return miniData;
}