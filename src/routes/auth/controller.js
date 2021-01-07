const authService = require('../../services/auth');
const emailService = require('../../services/email');
const userService = require('../../services/user');
const redisService = require('../../services/redis');
const { validationResult } = require('express-validator');

exports.index = (req, res) => {
  res.status(200).send({ message: 'Authenticate' });
}

exports.login = async (req, res) => {
  if (req.headers.authorization) {
    return res.status(403).send({ error: 'Remove your Authorization header before logging in' });
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const { username, password } = req.body;
  try {
    var user = await authService.authenticate(username, password);
  } catch (e) {
    return res.status(400).send({ error: e });
  }
  const accessToken = authService.signAccessToken(user);
  const refreshToken = authService.signRefreshToken(user);
  try {
    await redisService.setRefreshToken(refreshToken, user);
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: 'Internal server error' });
  }
  res.status(200).send({ accessToken, refreshToken });
}

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const { username, displayName, dateOfBirth, email, password } = req.body;
  // Create user
  const user = authService.createUser(username, displayName, dateOfBirth, email, password);
  // Send confirmation email and response user info
  try {
    user.activationCode = emailService.sendConfirmEmail(user);
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: 'Internal server error' });
  }
  // Save user
  try {
    await user.save();
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: 'Internal server error' });
  }
  res.status(200).send({
    username: user.username,
    email: user.email,
    displayName: user.displayName,
    message: 'A confirmation email is being sent'
  });
}

exports.sendConfirmEmail = async (req, res) => {
  const user = req.currentUser;
  if (!user.new) {
    return res.status(400).send({ error: 'User already activated' });
  }
  const { type } = req.body;
  try {
    if (type && type === 'update') {
      user.activationCode = emailService.sendUpdateEmail(user);
    } else {
      user.activationCode = emailService.sendConfirmEmail(user);
    }
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: 'Internal server error' });
  }
  try {
    await user.save();
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: 'Internal server error' });
  }
  res.status(200).send({ message: 'A confirmation email is being sent' });
}

exports.sendRecoveryEmail = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  // Find user by email address
  const { email } = req.body;
  const user = await userService.findUserByEmail(email);
  if (!user) {
    return res.status(404).send({ error: 'User not found' });
  }
  // Send recovery email
  try {
    user.recoveryCode = emailService.sendRecoveryEmail(user);
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: 'Internal server error' });
  }
  try {
    await user.save();
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: 'Internal server error' });
  }
  res.status(200).send({ message: 'A recovery email is being sent' });
}

exports.confirmEmail = async (req, res) => {
  const { activationCode } = req.body;
  if (!activationCode) {
    return res.status(422).send({ error: 'Activation code must not be empty' });
  }
  const user = await authService.findByActivationCode(activationCode);
  if (!user) {
    return res.status(404).send({ error: 'Invalid or expired link' });
  }
  user.new = false;
  user.activationCode = null;
  try {
    await user.save();
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: 'Internal server error' });
  }
  res.status(200).send({ message: 'Email has been successfully confirmed' })
}

exports.passwordRecovery = async (req, res) => {
  const { recoveryCode } = req.body;
  if (!recoveryCode) {
    return res.status(422).send({ error: 'Recovery code must not be empty' });
  }
  const user = await authService.findUserByRecoveryCode(recoveryCode);
  if (!user) {
    return res.status(404).send({ error: 'Invalid or expired link' });
  }
  res.status(200).send({ message: 'Password can be reseted' })
}

exports.resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const { recoveryCode, password } = req.body;
  const user = await authService.resetPassword(recoveryCode, password);
  if (!user) {
    return res.status(404).send({ error: 'Invalid or expired link' });
  }
  res.status(200).send({ message: 'Password has been successfully reseted' })
}

exports.refreshToken = async (req, res) => {
  const user = req.currentUser;
  try {
    const check = await redisService.get(req.refreshToken);
    var data = check ? JSON.parse(check) : check;
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: 'Internal server error' });
  }
  if (!data) {
    return res.status(401).send({ error: 'Account credentials were lost' });
  }
  if (data.username !== user.username || data.password !== user.password) {
    return res.status(401).send({ error: 'Account credentials were changed' });
  }
  const accessToken = authService.signAccessToken(user);
  const refreshToken = authService.signRefreshToken(user);
  res.status(200).send({ accessToken, refreshToken });
}

exports.revokeToken = async (req, res) => {
  try {
    var check = await redisService.del(req.refreshToken);
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: 'Internal server error' });
  }
  if (!check) {
    return res.status(200).send({ message: 'Token is no longer valid' });
  }
  res.status(200).send({ message: 'Token has been revoked' });
}