const authService = require('../services/auth');
const userService = require('../services/user');

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
    const user = await userService.findUserById(decoded._id);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    req.currentUser = user;
    next()
  } catch (e) {
    console.error(e);
    return res.status(401).send({ error: 'Unauthorized access' });
  }
};