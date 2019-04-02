exports.datesToSql = (arr, objKey) => {
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

exports.replaceKeys = (arr, lookup, keyToRemove, keyToAdd) => {
  return arr.map(item => {
    item[keyToAdd] = lookup[item[keyToRemove]];
    delete item[keyToRemove];
    return item;
  });
};

exports.renameKeys = (arr, oldKeyName, newKeyName) => {
  return arr.map(obj => {
    const newObj = { ...obj };
    newObj[newKeyName] = newObj[oldKeyName];
    delete newObj[oldKeyName];
    return newObj;
  });
};
