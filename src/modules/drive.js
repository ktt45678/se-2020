const path = require('path');

exports.parseDirectories = (data) => {
  const miniData = {
    isSelected: false,
    files: []
  }
  let fileCount = 0;
  for (let i = 0; i < data.files.length; i++) {
    const { name, mimeType } = data.files[i];
    if (!mimeType?.endsWith('folder')) {
      fileCount++;
      continue;
    }
    miniData.files.push({ name, mimeType });
  }
  if (fileCount === data.files.length) {
    miniData.isSelected = true;
  }
  return miniData;
}

exports.parseFiles = (path_, data) => {
  const folder = path.basename(path_.split('?').shift());
  const miniData = {
    path: path_,
    file: folder,
    ext: null,
    quality: [],
    mimeType: null
  }
  for (let i = 0; i < data.files.length; i++) {
    const { name, mimeType } = data.files[i];
    if (!mimeType.startsWith('video') || !name.startsWith(folder)) {
      continue;
    }
    if (miniData.mimeType) {
      if (mimeType !== miniData.mimeType) {
        continue;
      }
    }
    const quality = Number(name?.substring(0, name?.indexOf('.')).replace(folder, '')?.replace('_', '')?.replace('p', ''));
    if (quality) {
      miniData.ext = path.extname(name);
      miniData.quality.push(quality);
      miniData.mimeType = mimeType;
    }
  }
  return miniData;
}