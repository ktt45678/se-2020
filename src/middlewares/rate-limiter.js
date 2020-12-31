const redisService = require('../services/redis');

module.exports = (expiry = 120) => {
  return async (req, res, next) => {
    // Should be user id or ip address
    if (!req.currentUser) {
      req.currentUser = { _id: req.ip }
    }
    const key = JSON.stringify({ user: req.currentUser._id, path: req.path, method: req.method });
    const ttl = await redisService.ttl(key);
    if (ttl >= 0) {
      return res.status(429).send({ ttl, message: `You can request again in ${ttl} seconds` });
    }
    next();
    if (res.statusCode >= 200 && res.statusCode <= 299) {
      await redisService.set(key, expiry, true);
    }
  }
}