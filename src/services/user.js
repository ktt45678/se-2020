const userModel = require('../models/user');
const cloudModule = require('../modules/cloud');
const imageModule = require('../modules/image');
const config = require('../../config.json').user;
const getStream = require('get-stream');
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
  const fileBuffer = await getStream.buffer(file.stream);
  const upload = await cloudModule.upload(fileBuffer, container, nanoId, file.originalName, file.size, file.detectedMimeType);
  const sizes = config.avatar_sizes;
  for (let i = 0; i < sizes.length; i++) {
    const size = sizes[i];
    let buffer
    if (file.detectedMimeType === 'image/gif') {
      buffer = await imageModule.resizeGif(fileBuffer, size, size);
    } else {
      buffer = await imageModule.resize(fileBuffer, size, size);
    }
    const filename = `${size}/${file.originalName}`;
    await cloudModule.upload(buffer, container, nanoId, filename, file.size, file.detectedMimeType);
    upload.quality.push(size);
  }
  return upload;
}

exports.findAvatar = (user) => {
  const avatar = user.storages.find(s => s.container === config.avatar_container);
  return avatar;
}

exports.getAvatar = (avatar, size) => {
  const imageSize = size ? imageModule.findClosestImageSize(size, config.avatar_sizes) : 0;
  const avatarName = imageSize ? `${imageSize}/${avatar.blobName}` : avatar.blobName;
  const token = cloudModule.token(avatar.container, avatar.nanoId, avatarName, config.avatar_expiry);
  return `${process.env.AZURE_STORAGE_URL}/${avatar.container}/${avatar.nanoId}/${avatarName}?${token}`;
}

exports.deleteAvatar = async (avatar) => {
  const result = await cloudModule.delete(config.avatar_container, avatar.nanoId, avatar.blobName);
  for (let i = 0; i < avatar.quality.length; i++) {
    const size = avatar.quality[i];
    const filename = `${size}/${avatar.blobName}`;
    await cloudModule.delete(config.avatar_container, avatar.nanoId, filename);
  }
  return result;
}

exports.uploadMusic = async (file) => {
  const container = config.music_container;
  const nanoId = nanoid();
  const fileBuffer = await getStream.buffer(file.stream);
  const upload = await cloudModule.upload(fileBuffer, container, nanoId, file.originalName, file.size, file.detectedMimeType);
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
  const fileBuffer = await getStream.buffer(file.stream);
  const upload = await cloudModule.upload(fileBuffer, container, nanoId, file.originalName, file.size, file.detectedMimeType);
  const sizes = config.background_sizes;
  for (let i = 0; i < sizes.length; i++) {
    const size = sizes[i];
    const buffer = await imageModule.resize(fileBuffer, size, size);
    const filename = `${size}/${file.originalName}`;
    await cloudModule.upload(buffer, container, nanoId, filename, file.size, file.detectedMimeType);
    upload.quality.push(size);
  }
  return upload;
}

exports.findBackground = (user) => {
  const background = user.storages.find(s => s.container === config.background_container);
  return background;
}

exports.getBackground = (background, size) => {
  const imageSize = size ? imageModule.findClosestImageSize(size, config.background_sizes) : 0;
  const backgroundName = imageSize ? `${imageSize}/${background.blobName}` : background.blobName;
  const token = cloudModule.token(background.container, background.nanoId, backgroundName, config.background_expiry);
  return `${process.env.AZURE_STORAGE_URL}/${background.container}/${background.nanoId}/${backgroundName}?${token}`;
}

exports.deleteBackground = async (background) => {
  const result = await cloudModule.delete(config.background_container, background.nanoId, background.blobName);
  for (let i = 0; i < background.quality.length; i++) {
    const size = background.quality[i];
    const filename = `${size}/${background.blobName}`;
    await cloudModule.delete(config.background_container, background.nanoId, filename);
  }
  return result;
}