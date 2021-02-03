const multer = require('multer');

exports.avatar = multer({
  limits: {
    fileSize: 8388608
  }
});

exports.background = multer({
  limits: {
    fileSize: 8388608
  }
});

exports.audio = multer({
  limits: {
    fileSize: 12582912
  }
});