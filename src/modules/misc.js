exports.toExclusionString = (string) => {
  return `-${string.replace(',', ' -')}`;
}

exports.calculatePageSkip = (page, limit) => {
  if (!page || !limit) {
    return 0;
  }
  return limit * (page - 1);
}

exports.toSortQuery = (sortString) => {
  const sort = {}
  const sortList = sortString.split(',');
  for (let i = 0; i < sortList.length; i++) {
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
  for (let i = 0; i < keys.length; i++) {
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