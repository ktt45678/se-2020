const authService = require('../../services/auth');
const emailService = require('../../services/email');
const userService = require('../../services/user');
const { validationResult } = require('express-validator');

exports.index = (req, res) => {
  res.status(200).send({ message: 'Authenticate' });
}

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const { username, password } = req.body;
  try {
    const user = await authService.authenticate(username, password);
    const accessToken = authService.signAccessToken(user);
    const refreshToken = authService.signRefreshToken(user);
    res.status(200).send({ accessToken, refreshToken });
  } catch (e) {
    res.status(400).send({ error: e });
  }
}

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const { username, displayName, dateOfBirth, email, password } = req.body;
  // Create user
  const user = authService.createUser(username, displayName, dateOfBirth, email, password);
  // Error handler
  try {
    await user.save();
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: 'Internal server error' });
  }
  // Send confirmation email and response user info
  try {
    emailService.sendConfirmEmail(user);
    res.status(200).send({
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      message: 'A confirmation email is being sent'
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: 'Internal server error' });
  }
}

exports.sendConfirmEmail = async (req, res) => {
  const user = req.currentUser;
  if (!user.role.startsWith('new')) {
    return res.status(400).send({ error: 'User already activated' });
  }
  // Update user's activation code
  user.activationCode = authService.createNanoId();
  try {
    await user.save();
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: 'Internal server error' });
  }
  try {
    emailService.sendConfirmEmail(user);
    res.status(200).send({ message: 'A confirmation email is being sent' });
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: 'Internal server error' });
  }
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
  // Update user's recovery code
  user.recoveryCode = authService.createNanoId();
  try {
    await user.save();
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: 'Internal server error' });
  }
  // Send recovery email
  try {
    emailService.sendRecoveryEmail(user);
    res.status(200).send({ message: 'A recovery email is being sent' });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: 'Internal server error' });
  }
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
  user.role = user.role.split(' ')[1];
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
  // This user object contains only _id
  const user = req.currentUser;
  const accessToken = authService.signAccessToken(user);
  const refreshToken = authService.signRefreshToken(user);
  res.status(200).send({ accessToken, refreshToken });
}