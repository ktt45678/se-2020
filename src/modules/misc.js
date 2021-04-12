exports.toExclusionQuery = (exclusionString) => {
  if (!exclusionString)
    return undefined;
  const exclusions = {};
  const exclusionList = uniqString(exclusionString.split(','));
  let i = exclusionList.length;
  while (i--)
    exclusions[exclusionList[i]] = 0;
  return exclusions;
}

exports.toFieldQuery = (fieldString) => {
  if (!fieldString)
    return undefined;
  const fields = {};
  const fieldType = fieldString.startsWith('<') ? 1 : 0;
  fieldString = fieldString.substring(1);
  const fieldList = uniqString(fieldString.split(','));
  let i = fieldList.length;
  while (i--)
    fields[fieldList[i]] = fieldType;
  return fields;
}

exports.calculatePageSkip = (page, limit) => {
  if (!page || !limit)
    return 0;
  return limit * (page - 1);
}

exports.toSortQuery = (sortString) => {
  if (!sortString)
    return undefined;
  const sort = {};
  const sortList = sortString.split(',');
  let i = sortList.length;
  while (i--) {
    const sortValue = sortList[i].startsWith('<') ? -1 : 1;
    sortList[i] = sortList[i].substring(1);
    sort[sortList[i]] = sortValue;
  }
  return sort;
}

exports.overrideData = (source, target, exclusions = []) => {
  if (!target)
    return undefined;
  const isMongooseModel = typeof source.toObject === 'function';
  const keys = isMongooseModel ? Object.keys(source.toObject()) : Object.keys(source);
  let i = keys.length;
  while (i--) {
    const key = keys[i];
    if (exclusions.includes(key))
      continue;
    if (key in target)
      source[key] = target[key];
  }
  return source;
}

// Unique values for array of fields
function uniqString(array) {
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