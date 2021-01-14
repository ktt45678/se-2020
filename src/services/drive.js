const driveModule = require('../modules/drive');
const request = require('../modules/request');

exports.getDirectories = async (path) => {
  const url = `${process.env.GDRIVE_URL}/${path}`;
  return await request.post(url);
}

exports.parseDirectories = (data) => {
  return driveModule.parseDirectories(data);
}

exports.isValidPath = (path) => {
  return driveModule.isValidPath(path);
}