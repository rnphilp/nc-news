const articlesRouter = require('express').Router();
const articleCommentsRouter = require('./article-comments-router');

const {
  fetchArticles,
  fetchArticle,
  updateArticle,
  removeArticle,
} = require('../controllers/articles-controller');
const { methodNotAllowed } = require('../errors');

articlesRouter
  .route('/')
  .get(fetchArticles)
  .all(methodNotAllowed);

articlesRouter
  .route('/:article_id')
  .get(fetchArticle)
  .patch(updateArticle)
  .delete(removeArticle)
  .all(methodNotAllowed);

articlesRouter.use('/:article_id/comments', articleCommentsRouter);

module.exports = articlesRouter;
