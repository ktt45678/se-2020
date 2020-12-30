const redisModule = require('../modules/redis');
const config = require('../../config.json');

exports.get = async (key) => {
  return await redisModule.getAsync(key);
}

exports.setRefreshToken = async (refreshToken, user) => {
  const { refresh_token_life } = config.auth;
  const { username, password } = user;
  return await redisModule.setAsync(refreshToken, refresh_token_life, JSON.stringify({ username, password }));
}

exports.del = async (key) => {
  return await redisModule.delAsync(key);
}