exports.objDateToSql = (arr, objKey) => {
  return arr.map(obj => {
    const newObj = { ...obj };
    newObj[objKey] = new Date(newObj[objKey]).toISOString();
    return newObj;
  });
};

exports.createLookup = (arr, key, value) => {
  return arr.reduce((obj, item) => {
    obj[item[key]] = item[value];
    return obj;
  }, {});
};
