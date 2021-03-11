const authService = require('../../services/auth');
const emailService = require('../../services/email');
const userService = require('../../services/user');
const redisService = require('../../services/redis');
const { validationResult } = require('express-validator');

exports.view = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const user = req.currentUser;
  const { id } = req.params;
  if (!id && !user) {
    return res.status(404).send({ error: 'User not found' });
  } else if ((!id && user) || (id === user?._id)) {
    const { _id, username, displayName, email, dateOfBirth, role, createdAt } = user;
    return res.status(200).send({ _id, username, displayName, email, dateOfBirth, role, createdAt });
  }
  try {
    const search = await userService.findUserById(id);
    if (!search) {
      return res.status(404).send({ error: 'User not found' });
    }
    const { _id, username, displayName, role, createdAt } = search;
    res.status(200).send({ _id, username, displayName, role, createdAt });
  } catch (e) {
    next(e);
  }
}

exports.update = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const user = req.currentUser;
  const { username, displayName, email, dateOfBirth, currentPassword, newPassword } = req.body;
  const isUsernameChanged = user.username !== username;
  const isEmailChanged = user.email !== email;
  const requirePassword = isUsernameChanged || isEmailChanged || newPassword;
  try {
    // Try to validate current password
    if (requirePassword) {
      if (!currentPassword) {
        return res.status(422).send({ error: 'Current password is required' });
      }
      await authService.authenticate(user.username, currentPassword);
    }
    user.username = username;
    user.displayName = displayName;
    user.dateOfBirth = dateOfBirth;
    // Users will have to confirm their new email
    if (user.email !== email) {
      user.email = email;
      user.new = true;
      user.activationCode = await emailService.sendUpdateEmail(user);
    }
    if (newPassword) {
      user.password = await authService.hashPassword(newPassword);
    }
    await user.save();
    const accessToken = authService.signAccessToken(user);
    const refreshToken = authService.signRefreshToken(user);
    await redisService.setRefreshToken(refreshToken, user);
    res.status(200).send({ accessToken, refreshToken, isEmailChanged, message: 'Successfully updated' });
  } catch (e) {
    next(e);
  }
}