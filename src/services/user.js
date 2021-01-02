const userModel = require('../models/user');
const cloudModule = require('../modules/cloud');
const config = require('../../config.json').user;
const { nanoid } = require('nanoid');

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

exports.uploadAvatar = async (file) => {
  const container = config.avatar_container;
  const nanoId = nanoid();
  const upload = await cloudModule.upload(file.buffer, container, nanoId, file.originalname, file.size, file.mimetype);
  return upload;
}

exports.findAvatar = (user) => {
  const avatar = user.storages.find(s => s.container === config.avatar_container);
  return avatar;
}

exports.getAvatar = (avatar) => {
  const token = cloudModule.token(avatar.container, avatar.nanoId, avatar.blobName, config.avatar_expiry);
  return `${process.env.AZURE_STORAGE_URL}/${avatar.container}/${avatar.nanoId}/${avatar.blobName}?${token}`;
}

exports.deleteAvatar = async (avatar) => {
  return await cloudModule.delete(config.avatar_container, avatar.nanoId, avatar.blobName);
}

exports.uploadMusic = async (file) => {
  const container = config.music_container;
  const nanoId = nanoid();
  const upload = await cloudModule.upload(file.buffer, container, nanoId, file.originalname, file.size, file.mimetype);
  return upload;
}

exports.findMusic = (user) => {
  const music = user.storages.find(s => s.container === config.music_container);
  return music;
}

exports.getMusic = (music) => {
  const token = cloudModule.token(music.container, music.nanoId, music.blobName, config.music_expiry);
  return `${process.env.AZURE_STORAGE_URL}/${music.container}/${music.nanoId}/${music.blobName}?${token}`;
}

exports.deleteMusic = async (music) => {
  return await cloudModule.delete(config.music_container, music.nanoId, music.blobName);
}

exports.uploadBackground = async (file) => {
  const container = config.background_container;
  const nanoId = nanoid();
  const upload = await cloudModule.upload(file.buffer, container, nanoId, file.originalname, file.size, file.mimetype);
  return upload;
}

exports.findBackground = (user) => {
  const background = user.storages.find(s => s.container === config.background_container);
  return background;
}

exports.getBackground = (background) => {
  const token = cloudModule.token(background.container, background.nanoId, background.blobName, config.background_expiry);
  return `${process.env.AZURE_STORAGE_URL}/${background.container}/${background.nanoId}/${background.blobName}?${token}`;
}

exports.deleteBackground = async (background) => {
  return await cloudModule.delete(config.background_container, background.nanoId, background.blobName);
}