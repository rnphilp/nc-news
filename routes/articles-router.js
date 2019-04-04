const articlesRouter = require('express').Router();
const { fetchArticles, fetchArticle, updateArticle } = require('../controllers/articles-controller');
const { methodNotAllowed } = require('../errors');

articlesRouter
  .route('/')
  .get(fetchArticles)
  .all(methodNotAllowed);

articlesRouter
  .route('/:article_id')
  .get(fetchArticle)
  .patch(updateArticle)
  .all(methodNotAllowed);

module.exports = articlesRouter;
