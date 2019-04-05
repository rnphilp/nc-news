const { getArticleComments, postArticleComment } = require('../models/article-comments-model');

exports.fetchArticleComments = (req, res, next) => {
  getArticleComments(req.params, req.query)
    .then((comments) => {
      if (comments.length < 1) {
        return Promise.reject({
          status: 404,
          msg: `article_id '${req.params.article_id}' Could Not Be Found`,
        });
      }
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.sendArticleComment = (req, res, next) => {
  postArticleComment(req.params, req.body)
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
