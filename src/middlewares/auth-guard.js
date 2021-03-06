const authService = require('../services/auth');
const userService = require('../services/user');

module.exports = (options = { bypass: false }) => {
  return async (req, res, next) => {
    const bypass = options.bypass;
    const { authorization } = req.headers;
    if (!authorization) {
      if (bypass) {
        return next();
      }
      return res.status(401).send({ error: 'No authorization' });
    }
    const accessToken = authorization.split(" ")[1];
    if (!accessToken) {
      return res.status(401).send({ error: 'Access token is empty' });
    }
    try {
      const decoded = await authService.verifyAccessToken(accessToken);
      const user = await userService.findUserById(decoded._id);
      if (!user) {
        return res.status(404).send({ error: 'User not found' });
      }
      req.currentUser = user;
      next()
    } catch (e) {
      res.status(401).send({ error: 'Unauthorized access' });
    }
  }
}