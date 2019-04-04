const { getArticles } = require('../models/articles-model');

exports.fetchArticles = (req, res) => {
  getArticles(req.query).then((articles) => {
    res.status(200).json({ articles });
  });
};

exports.fetchArticle = (req, res) => {
  getArticles(req.params).then(([article]) => {
    res.status(200).json({ article });
  });
};
