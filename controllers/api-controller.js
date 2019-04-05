const apiContent = require('../db/data/api-content');

exports.fetchApi = (req, res) => {
  res.status(200).json(apiContent);
};
