const cloudinary = require('cloudinary').v2;

exports.fetchImage = (url) => {
  return cloudinary.url(url, { type: 'fetch', sign_url: true });
}

exports.fetchImageToSize = (url, width, height) => {
  return cloudinary.url(url, { width, height, crop: 'limit', type: 'fetch', sign_url: true });
}