const multer = require('multer');

exports.avatar = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, callback) => {
    mimetypes = ['image/png', 'image/gif', 'image/jpeg', 'image/bmp'];
    if (!mimetypes.includes(file.mimetype)) {
      return callback(new Error('Unsupported image format'));
    }
    callback(null, true);
  },
  limits: {
    fileSize: 8388608
  }
});

exports.background = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, callback) => {
    mimetypes = ['image/png', 'image/jpeg', 'image/bmp'];
    if (!mimetypes.includes(file.mimetype)) {
      return callback(new Error('Unsupported image format'));
    }
    callback(null, true);
  },
  limits: {
    fileSize: 8388608
  }
});

exports.audio = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, callback) => {
    mimetypes = ['audio/wave', 'audio/x-wav', 'audio/mpeg', 'audio/ogg', 'audio/opus', 'audio/mp4', 'audio/webm'];
    if (!mimetypes.includes(file.mimetype)) {
      return callback(new Error('Unsupported audio format'));
    }
    callback(null, true);
  },
  limits: {
    fileSize: 12582912
  }
});