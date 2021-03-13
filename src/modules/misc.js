exports.toExclusionQuery = (exclusionString) => {
  if (!exclusionString) {
    return null;
  }
  const exclusions = {};
  const exclusionList = uniqExclusion(exclusionString.split(','));
  let i = exclusionList.length;
  while (i--) {
    exclusions[exclusionList[i]] = 0;
  }
  return exclusions;
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

// Unique values for exclusion array
function uniqExclusion(array) {
  array = array.sort();
  let i = 0;
  while (i < array.length) {
    let j = i + 1;
    while (j < array.length) {
      if (array[j].startsWith(array[i])) {
        array.splice(j, 1);
      } else {
        j++;
      }
    }
    i++;
  }
  return array;
}