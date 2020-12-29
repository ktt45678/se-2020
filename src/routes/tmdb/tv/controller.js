const tmdbService = require('../../../services/tmdb');

exports.index = (req, res) => {
  res.status(200).send({ message: 'TV Show' });
};

exports.details = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await tmdbService.tv(id);
    const data = tmdbService.parseTvData(response.data);
    res.status(200).send(data);
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return res.status(404).send({ error: 'TV Show not found' });
    }
    console.error(err);
    res.status(500).send({ error: 'Internal server error' });
  }
};