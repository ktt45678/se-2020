const authService = require('../services/auth');

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send({ error: 'No authorization' });
  }
  const refreshToken = authorization.split(" ")[1];
  if (!refreshToken) {
    return res.status(401).send({ error: 'Refresh token is empty' });
  }
  try {
    const decoded = await authService.verifyRefreshToken(refreshToken);
    req.currentUser = decoded;
    next()
  } catch (e) {
    res.status(401).send({ error: 'Unauthorized access' });
  }
};