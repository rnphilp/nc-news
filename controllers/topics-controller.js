const { getTopics } = require('../models/topics-model');

exports.fetchTopics = (req, res) => {
  getTopics().then(topics => {
    res.status(200).json({ topics });
  });
};
