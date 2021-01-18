const driveService = require('../../services/drive');

exports.get = async (req, res, next) => {
  const path = req.params[0];
  try {
    const response = await driveService.getDirectories(path);
    const result = driveService.parseDirectories(response.data);
    res.status(200).send(result);
  } catch (e) {
    next(e);
  }
}