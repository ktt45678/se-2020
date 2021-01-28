const config = require('../../config.json').media;

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
  let i = 0;
  while (i < genres.length) {
    miniData.genres.push(genres[i].name);
    i++;
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
  let i = 0;
  while (i < genres.length) {
    miniData.genres.push(genres[i].name);
    i++;
  }
  i = 0;
  while (i < seasons.length) {
    const { air_date, season_number } = seasons[i];
    miniData.tvShow.seasons.push({ airDate: air_date, seasonNumber: season_number });
    i++;
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
  let i = 0;
  while (i < episodes.length) {
    const { air_date, episode_number } = episodes[i];
    miniData.episodes.push({ airDate: air_date, episodeNumber: episode_number });
    i++;
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
  let i = 0;
  while (i < castLimit) {
    const { credit_id, name, original_name, profile_path, known_for_department, character } = data.cast[i];
    miniData.push({
      tmdbId: credit_id,
      name: name,
      originalName: original_name,
      profilePath: profile_path,
      department: known_for_department,
      cast: { character }
    });
    i++;
  }
  i = 0;
  while (i < crewLimit) {
    const { credit_id, name, original_name, profile_path, department, job } = data.crew[i];
    miniData.push({
      tmdbId: credit_id,
      name: name,
      originalName: original_name,
      profilePath: profile_path,
      department: department,
      crew: { job }
    });
    i++;
  }
  return miniData;
}

exports.parseVideoData = (data) => {
  const { video_limit } = config;
  const videoLimit = data.results.length > video_limit ? video_limit : data.results.length;
  const miniData = [];
  let i = 0;
  while (i < videoLimit) {
    const { name, site, key, type } = data.results[i];
    miniData.push({ name, site, key, type });
    i++;
  }
  return miniData;
}

exports.parseMediaResult = (posterUrl, backdropUrl, result) => {
  result.posterPath = result.posterPath ? `${posterUrl}${result.posterPath}` : null;
  result.backdropPath = result.backdropPath ? `${backdropUrl}${result.backdropPath}` : null;
  return result;
}

exports.parseTvSeasonResult = (posterUrl, stillUrl, seasons) => {
  let i = seasons.length;
  while (i--) {
    if (!seasons[i].isAdded) {
      continue;
    }
    seasons[i].posterPath = seasons[i].posterPath ? `${posterUrl}${seasons[i].posterPath}` : null;
    let j = seasons[i].episodes.length;
    while (j--) {
      if (!seasons[i].episodes[j].isAdded) {
        continue;
      }
      seasons[i].episodes[j].stillPath = seasons[i].episodes[j].stillPath ? `${stillUrl}${seasons[i].episodes[j].stillPath}` : null;
    }
  }
  return seasons;
}

exports.parseCreditResult = (profileUrl, credits) => {
  let i = credits.length;
  while (i--) {
    credits[i].profilePath = credits[i].profilePath ? `${profileUrl}${credits[i].profilePath}` : null;
  }
  return credits;
}

exports.createStreamUrls = (baseUrl, stream) => {
  const urls = [];
  let i = 0;
  while (i < stream.quality.length) {
    urls.push({
      quality: stream.quality[i],
      mimeType: stream.mimeType,
      url: `${baseUrl}/${stream.path}${stream.file}_${stream.quality[i]}p${stream.ext}`
    });
    i++;
  }
  return urls;
}