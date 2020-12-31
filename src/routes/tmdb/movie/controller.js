const tmdbService = require('../../../services/tmdb');

exports.index = (req, res) => {
  res.status(200).send({ message: 'Movie' });
}

exports.details = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await tmdbService.movie(id);
    const data = tmdbService.parseMovieData(response.data);
    res.status(200).send(data);
  } catch (err) {
    if (err.response?.status && err.response?.statusText) {
      return res.status(err.response.status).send({ error: err.response.statusText });
    }
    console.error(err);
    res.status(500).send({ error: 'Internal server error' });
  }
}