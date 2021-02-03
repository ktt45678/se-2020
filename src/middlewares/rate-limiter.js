const redisService = require('../services/redis');

module.exports = (expiry = 120, limit = 1, errorMode = false) => {
  return async (req, res, next) => {
    // Should be user id or ip address
    if (!req.currentUser) {
      req.currentUser = { _id: req.ip }
    }
    // A combination of user's id (or ip address), request path, request method and error mode
    const key = JSON.stringify({ user: req.currentUser._id, path: req.originalUrl, method: req.method, error: errorMode });
    try {
      // Check if the key exists. If not, set the quota value to 0
      var value = await redisService.get(key) || 0;
      // Return error 429 when reached the limit
      if (value >= limit) {
        const ttl = await redisService.ttl(key);
        if (ttl >= 0) {
          return res.status(429).send({ ttl, message: `You can request again in ${ttl} seconds` });
        }
      }
    } catch (e) {
      console.error(e);
      return res.status(500).send({ error: 'Internal server error' });
    }
    res.on('finish', async () => {
      if (!errorMode) {
        // Update the key on successful response
        if (res.statusCode >= 200 && res.statusCode <= 299) {
          value++;
          try {
            await redisService.set(key, expiry, value);
          } catch (e) {
            console.error(e);
          }
        }
      } else {
        // Update the key on error response
        // Do not increase the quota value on error 429
        if (res.statusCode >= 400 && res.statusCode <= 499 && res.statusCode !== 429) {
          value++;
          try {
            await redisService.set(key, expiry, value);
          } catch (e) {
            console.error(e);
          }
        }
        // Delete on successful response
        if (res.statusCode >= 200 && res.statusCode <= 299) {
          try {
            await redisService.del(key);
          } catch (e) {
            console.error(e);
          }
        }
      }
    });
    next();
  }
}