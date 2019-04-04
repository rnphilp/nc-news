const { getArticleComments, postArticleComment } = require('../models/article-comments-model');

exports.fetchArticleComments = (req, res) => {
  getArticleComments(req.params, req.query).then((comments) => {
    res.status(200).send({ comments });
  });
};

exports.sendArticleComment = (req, res) => {
  postArticleComment(req.params, req.body).then(([createdComment]) => {
    res.status(202).send({ createdComment });
  });
};
