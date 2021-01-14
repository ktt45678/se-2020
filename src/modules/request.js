const axios = require('axios');

exports.get = async (url, options = {}) => {
  return await axios.get(url, options);
}

exports.post = async (url, data = {}, options = {}) => {
  return await axios.post(url, data, options);
}