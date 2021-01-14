const url = require('url')
const path = require('path');

exports.parseDirectories = (data) => {
  const miniData = {
    isSelected: false,
    files: []
  }
  let fileCount = 0;
  for (let i = 0; i < data.files.length; i++) {
    const { name, mimeType } = data.files[i];
    if (!mimeType.endsWith('folder')) {
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

exports.isValidPath = (path_) => {
  const parsed = url.parse(path_);
  const basename = path.basename(parsed.pathname);
  if (basename.match(/[^\\]*\.(\w+)$/g)) {
    return false;
  }
  return true;
}