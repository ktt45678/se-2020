exports.toExclusionQuery = (exclusionString) => {
  if (!exclusionString) {
    return null;
  }
  const exclusion = {};
  const exclusionList = exclusionString.split(',');
  let i = exclusionList.length;
  while (i--) {
    exclusion[exclusionList[i]] = 0;
  }
  return exclusion;
}

exports.calculatePageSkip = (page, limit) => {
  if (!page || !limit) {
    return 0;
  }
  return limit * (page - 1);
}

exports.toSortQuery = (sortString) => {
  if (!sortString) {
    return null;
  }
  const sort = {};
  const sortList = sortString.split(',');
  let i = sortList.length;
  while (i--) {
    const sortItem = sortList[i].split(':');
    sort[sortItem[0]] = Number(sortItem[1]);
  }
  return sort;
}

exports.overrideData = (source, target, exclusions = []) => {
  if (!target) {
    return null;
  }
  const isMongooseModel = typeof source.toObject === 'function';
  const keys = isMongooseModel ? Object.keys(source.toObject()) : Object.keys(source);
  let i = keys.length;
  while (i--) {
    const key = keys[i];
    if (exclusions.includes(key)) {
      continue;
    }
    if (key in target) {
      source[key] = target[key];
    }
  }
  return source;
}