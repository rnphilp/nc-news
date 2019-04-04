const { getArticleComments } = require('../models/article-comments-model');

exports.fetchArticleComments = (req, res) => {
  getArticleComments(req.params, req.query).then((comments) => {
    res.status(200).send({ comments });
  });
};
