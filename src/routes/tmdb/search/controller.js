const tmdbService = require('../../../services/tmdb');
const { validationResult } = require('express-validator');

exports.index = (req, res) => {
  res.status(200).send({ message: 'Search' });
}

exports.search = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const { query, page, include_adult, primary_release_year, first_air_date_year } = req.query;
  const { type } = req.params;
  try {
    const response = await tmdbService.search(type, query, page, include_adult, primary_release_year, first_air_date_year);
    const data = type === 'movie' ? tmdbService.parseMovieSearch(response.data) : tmdbService.parseTvSearch(response.data);
    res.status(200).send(data);
  } catch (e) {
    next(e);
  }
}