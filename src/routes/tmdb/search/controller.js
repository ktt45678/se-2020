const tmdbService = require('../../../services/tmdb');
const { validationResult } = require('express-validator');

exports.index = (req, res) => {
  res.status(200).send({ message: 'Search' });
}

exports.search = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const { query, page, include_adult } = req.query;
  const { type } = req.params;
  try {
    const response = await tmdbService.search(type, query, page, include_adult);
    const data = type === 'movie' ? tmdbService.parseMovieSearch(response.data) : tmdbService.parseTvSearch(response.data);
    res.status(200).send(data);
  } catch (err) {
    if (err.response?.status && err.response?.statusText) {
      return res.status(err.response.status).send({ error: err.response.statusText });
    }
    console.error(err);
    res.status(500).send({ error: 'Internal server error' });
  }
}