const redisService = require('../services/redis');

module.exports = (expiry = 120) => {
  return async (req, res, next) => {
    // Should be user id or ip address
    if (!req.currentUser) {
      req.currentUser = { _id: req.ip }
    }
    const key = JSON.stringify({ user: req.currentUser._id, path: req.path, method: req.method });
    try {
      const ttl = await redisService.ttl(key);
      if (ttl >= 0) {
        return res.status(429).send({ ttl, message: `You can request again in ${ttl} seconds` });
      }
    } catch (e) {
      console.error(e);
      return res.status(500).send({ error: 'Internal server error' });
    }
    res.on('finish', async () => {
      if (res.statusCode >= 200 && res.statusCode <= 299) {
        try {
          await redisService.set(key, expiry, true);
        } catch (e) {
          console.error(e);
        }
      }
    });
    next();
  }
}