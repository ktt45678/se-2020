const sharp = require('sharp');

exports.findClosestImageSize = (size, sizes) => {
  const target = Number(size);
  const closest = sizes.reduce((prev, curr) => {
    return (Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev);
  });
  return closest;
}

exports.resize = async (fileBuffer, width, height) => {
  const transformer = await sharp(fileBuffer)
    .resize(width, height, { fit: 'inside', withoutEnlargement: true })
    .toBuffer();
  return transformer;
}