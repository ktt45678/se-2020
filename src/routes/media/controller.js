const mediaService = require('../../services/media');

exports.view = (req, res) => {
  res.status(200).send({ message: 'View' });
}

exports.list = (req, res) => {
  res.status(200).send({ message: 'List' });
}

exports.search = (req, res) => {
  res.status(200).send({ message: 'Search' });
}

exports.stream = (req, res) => {
  res.status(200).send({ message: 'Stream' });
}

exports.add = async (req, res) => {
  res.status(200).send({ message: 'Add' });
}

exports.update = (req, res) => {
  res.status(200).send({ message: 'Update' });
}

exports.delete = (req, res) => {
  res.status(200).send({ message: 'Delete' });
}