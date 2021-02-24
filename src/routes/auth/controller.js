const authService = require('../../services/auth');
const emailService = require('../../services/email');
const userService = require('../../services/user');
const redisService = require('../../services/redis');
const { validationResult } = require('express-validator');

exports.index = (req, res) => {
  res.status(200).send({ message: 'Authentication' });
}

exports.login = async (req, res, next) => {
  if (req.headers.authorization) {
    return res.status(403).send({ error: 'Remove your authorization header before logging in' });
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const { username, password } = req.body;
  try {
    const user = await authService.authenticate(username, password);
    const accessToken = authService.signAccessToken(user);
    const refreshToken = authService.signRefreshToken(user);
    await redisService.setRefreshToken(refreshToken, user);
    res.status(200).send({ accessToken, refreshToken });
  } catch (e) {
    next(e);
  }
}

exports.register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const { username, displayName, dateOfBirth, email, password } = req.body;
  try {
    // Create user
    const user = await authService.createUser(username, displayName, dateOfBirth, email, password);
    // Send confirmation email and response user info
    user.activationCode = await emailService.sendConfirmEmail(user);
    // Save user in database
    await user.save();
    res.status(200).send({
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      message: 'A confirmation email is being sent'
    });
  } catch (e) {
    next(e);
  }
}

exports.sendConfirmEmail = async (req, res, next) => {
  const user = req.currentUser;
  if (!user.new) {
    return res.status(400).send({ error: 'User has already been activated' });
  }
  const { type } = req.body;
  try {
    user.activationCode = type === 'update' ? await emailService.sendUpdateEmail(user) : await emailService.sendConfirmEmail(user);
    await user.save();
    res.status(200).send({ message: 'A confirmation email is being sent' });
  } catch (e) {
    next(e);
  }
}

exports.sendRecoveryEmail = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  // Find user by email address
  const { email } = req.body;
  try {
    const user = await userService.findUserByEmail(email);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    // Send recovery email
    user.recoveryCode = await emailService.sendRecoveryEmail(user);
    await user.save();
    res.status(200).send({ message: 'A recovery email is being sent' });
  } catch (e) {
    next(e);
  }
}

exports.confirmEmail = async (req, res, next) => {
  const { activationCode } = req.body;
  if (!activationCode) {
    return res.status(422).send({ error: 'Activation code must not be empty' });
  }
  try {
    const user = await authService.findByActivationCode(activationCode);
    if (!user) {
      return res.status(404).send({ error: 'Invalid or expired link' });
    }
    user.new = false;
    user.activationCode = null;
    await user.save();
    res.status(200).send({ message: 'Email has been successfully confirmed' });
  } catch (e) {
    next(e);
  }
}

exports.passwordRecovery = async (req, res, next) => {
  const { recoveryCode } = req.body;
  if (!recoveryCode) {
    return res.status(422).send({ error: 'Recovery code must not be empty' });
  }
  try {
    const user = await authService.findUserByRecoveryCode(recoveryCode);
    if (!user) {
      return res.status(404).send({ error: 'Invalid or expired link' });
    }
    res.status(200).send({ message: 'Password can be reseted' });
  } catch (e) {
    next(e);
  }
}

exports.resetPassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const { recoveryCode, password } = req.body;
  try {
    const user = await authService.resetPassword(recoveryCode, password);
    if (!user) {
      return res.status(404).send({ error: 'Invalid or expired link' });
    }
    res.status(200).send({ message: 'Password has been successfully reseted' });
  } catch (e) {
    next(e);
  }
}

exports.refreshToken = async (req, res, next) => {
  const user = req.currentUser;
  try {
    const check = await redisService.get(req.refreshToken);
    const data = check ? JSON.parse(check) : check;
    if (!data) {
      return res.status(401).send({ error: 'Account credentials were lost' });
    }
    if (data.username !== user.username || data.password !== user.password) {
      return res.status(401).send({ error: 'Account credentials were changed' });
    }
    const accessToken = authService.signAccessToken(user);
    const refreshToken = authService.signRefreshToken(user);
    await redisService.setRefreshToken(refreshToken, user);
    await redisService.del(req.refreshToken);
    res.status(200).send({ accessToken, refreshToken });
  } catch (e) {
    next(e);
  }
}

exports.revokeToken = async (req, res, next) => {
  try {
    const check = await redisService.del(req.refreshToken);
    if (!check) {
      return res.status(200).send({ message: 'Token is no longer valid' });
    }
    res.status(200).send({ message: 'Token has been revoked' });
  } catch (e) {
    next(e);
  }
}