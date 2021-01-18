exports.toExclusionString = (string) => {
  return `-${string.replace(',', ' -')}`;
}

exports.calculatePageSkip = (page, limit) => {
  return limit * (page - 1);
}

exports.toSortQuery = (sortString) => {
  const sort = {}
  const sortList = sortString.split(',');
  for (let i = 0; i < sortList.length; i++) {
    const sortItem = sortList[i].split(':');
    sort[sortItem[0]] = sortItem[1];
  }
  return sort;
}