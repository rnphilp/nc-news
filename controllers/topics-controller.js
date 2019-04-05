const { getTopics } = require('../models/topics-model');

exports.fetchTopics = (req, res, next) => {
  getTopics()
    .then((topics) => {
      res.status(200).json({ topics });
    })
    .catch(next);
};
