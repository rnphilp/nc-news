const { getArticleComments } = require('../models/article-comments-model');

exports.fetchArticleComments = (req, res) => {
  getArticleComments(req.params).then((comments) => {
    res.status(200).send({ comments });
  });
};
