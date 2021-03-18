const config = require('../../config.json').auth;
const userModel = require('../models/user');
const authModule = require('../modules/auth');

exports.authenticate = async (username, password) => {
  const user = await userModel.findByUsernameOrEmail(username);
  if (user && await userModel.comparePassword(password, user.password)) {
    return user;
  }
  throw { status: 400, message: 'Username or password is incorrect' };
}

exports.validatePassword = async (userId, password) => {
  const user = await userModel.findById(userId);
  if (user && await userModel.comparePassword(password, user.password)) {
    return true;
  }
  throw { status: 400, message: 'Your password is incorrect' };
}

exports.createUser = async (username, displayName, dateOfBirth, email, password) => {
  const role = email === process.env.OWNER_EMAIL ? 'admin' : 'member';
  const hashedPassword = await userModel.hashPassword(password);
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

exports.hashPassword = async (password) => {
  return await userModel.hashPassword(password);
}

exports.signAccessToken = (user) => {
  const signData = {
    _id: user._id,
    username: user.username,
    displayName: user.displayName,
    email: user.email,
    dateOfBirth: user.dateOfBirth,
    role: user.role,
    new: user.new,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
  const secret = process.env.ACCESS_TOKEN_SECRET || config.access_token_secret;
  const expiry = config.access_token_life;
  return authModule.signToken(signData, secret, expiry);
}

exports.signRefreshToken = (user) => {
  const { _id } = user;
  const secret = process.env.REFRESH_TOKEN_SECRET || config.refresh_token_secret;
  const expiry = config.refresh_token_life;
  return authModule.signToken({ _id }, secret, expiry);
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
  hashedPassword = await userModel.hashPassword(password);
  const user = await userModel.resetPassword(recoveryCode, hashedPassword);
  return user;
}