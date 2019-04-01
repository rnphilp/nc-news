const objDateToSql = (arr, objKey) => {
  return arr.map(obj => {
    const newObj = { ...obj };
    newObj[objKey] = new Date(newObj[objKey]).toISOString();
    return newObj;
  });
};

module.exports = { objDateToSql };
