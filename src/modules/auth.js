const jwt = require('jsonwebtoken');

exports.signToken = (data, secret, expiry) => {
  return jwt.sign(data, secret, { expiresIn: expiry });
}

exports.verifyToken = (token, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (error, decoded) => {
      if (error) {
        return reject(error);
      }
      resolve(decoded);
    });
  });
}