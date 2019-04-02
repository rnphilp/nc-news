const { getArticles } = require('../models/articles-model');

exports.fetchArticles = (req, res) => {
  getArticles().then((articles) => {
    res.status(200).json({ articles });
  });
};
