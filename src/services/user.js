const userModel = require('../models/user');

exports.findUserById = async (_id) => {
  const user = await userModel.findById(_id);
  return user;
}

exports.findUserByUsername = async (username) => {
  const user = await userModel.findByUsername(username);
  return user;
}

exports.findUserByEmail = async (email) => {
  const user = await userModel.findByEmail(email);
  return user;
}

exports.findUserByActivationCode = async (activationCode) => {
  const user = await userModel.findByActivationCode(activationCode);
  return user;
}

exports.findUserByRecoveryCode = async (recoveryCode) => {
  const user = await userModel.findByRecoveryCode(recoveryCode);
  return user;
}