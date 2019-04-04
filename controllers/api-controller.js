const { getApi } = require('../models/api-model');

exports.fetchApi = (req, res) => {
  const apiContent = getApi();
  res.status(200).json(apiContent);
};
