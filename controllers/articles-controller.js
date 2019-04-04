const { getArticles, patchArticle, deleteArticle } = require('../models/articles-model');

exports.fetchArticles = (req, res) => {
  getArticles(req.query).then((articles) => {
    res.status(200).json({ articles });
  });
};

exports.fetchArticle = (req, res, next) => {
  getArticles(req.params)
    .then(([article]) => {
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `article_id '${req.params.article_id}' Could Not Be Found`,
        });
      }
      res.status(200).json({ article });
    })
    .catch(next);
};

exports.updateArticle = (req, res, next) => {
  patchArticle(req.params, req.body)
    .then(([updatedArticle]) => {
      if (!updatedArticle) {
        return Promise.reject({
          status: 404,
          msg: `article_id '${req.params.article_id}' Could Not Be Found`,
        });
      }
      res.status(200).json({ updatedArticle });
    })
    .catch(next);
};

exports.removeArticle = (req, res, next) => {
  deleteArticle(req.params)
    .then(([removedArticle]) => {
      if (!removedArticle) {
        return Promise.reject({
          status: 404,
          msg: `article_id '${req.params.article_id}' Could Not Be Found`,
        });
      } res.status(204).send();
    })
    .catch(next);
};
