const config = require('../../config.json').auth;
const userModel = require('../models/user');
const authModule = require('../modules/auth');

exports.authenticate = async (username, password) => {
  const user = await userModel.findByUsernameOrEmail(username);
  if (!user || !userModel.comparePassword(password, user.password)) {
    throw 'Username or password is incorrect';
  }
  return user;
}

exports.createUser = (username, displayName, dateOfBirth, email, password) => {
  const role = email === process.env.OWNER_EMAIL ? 'new admin' : 'new member';
  const hashedPassword = userModel.hashPassword(password);
  const user = new userModel({
    username,
    displayName,
    email,
    password: hashedPassword,
    dateOfBirth,
    role
  });
  return user;
}

exports.hashPassword = (password) => {
  return userModel.hashPassword(password);
}

exports.signAccessToken = (user) => {
  const secret = process.env.ACCESS_TOKEN_SECRET || config.access_token_secret;
  const expiry = config.access_token_life;
  const data = {
    _id: user._id
  }
  return authModule.signToken(data, secret, expiry);
}

exports.signRefreshToken = (user) => {
  const secret = process.env.REFRESH_TOKEN_SECRET || config.refresh_token_secret;
  const expiry = config.refresh_token_life;
  const data = {
    _id: user._id
  }
  return authModule.signToken(data, secret, expiry);
}

exports.verifyAccessToken = async (accessToken) => {
  const secret = process.env.ACCESS_TOKEN_SECRET || config.access_token_secret;
  return await authModule.verifyToken(accessToken, secret);
}

exports.verifyRefreshToken = async (refreshToken) => {
  const secret = process.env.REFRESH_TOKEN_SECRET || config.refresh_token_secret;
  return await authModule.verifyToken(refreshToken, secret);
}

exports.findByActivationCode = async (activationCode) => {
  const user = await userModel.findByActivationCode(activationCode);
  return user;
}

exports.findUserByRecoveryCode = async (recoveryCode) => {
  const user = await userModel.findByRecoveryCode(recoveryCode);
  return user;
}

exports.resetPassword = async (recoveryCode, password) => {
  hashedPassword = userModel.hashPassword(password);
  const user = await userModel.resetPassword(recoveryCode, hashedPassword);
  return user;
}