const axios = require('axios');

exports.get = async (url, options = {}) => {
  const response = await axios.get(url, options);
  return response;
}