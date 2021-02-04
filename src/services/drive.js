const driveModule = require('../modules/drive');
const request = require('../modules/request');
const redisService = require('./redis');
const config = require('../../config.json').drive;

exports.getDirectories = async (path_) => {
  const path = path_ ? path_.endsWith('/') ? path_ : `${path_}/` : '';
  const url = `${process.env.GDRIVE_URL}/${path}`;
  return await request.post(url);
}

exports.parseDirectories = (data) => {
  if (!data || !data.files?.length) {
    throw { status: 404, message: 'Not found' }
  }
  if (data.isFile) {
    return res.status(403).send({ error: 'File is not supported' });
  }
  return driveModule.parseDirectories(data);
}

exports.parseFiles = (path, data) => {
  if (!data || !data.files?.length) {
    throw { status: 404, message: 'Not found' }
  }
  return driveModule.parseFiles(path, data);
}