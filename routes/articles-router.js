const articlesRouter = require('express').Router();
const {
  fetchArticleComments,
  sendArticleComment,
} = require('../controllers/article-comments-controller');

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

articlesRouter
  .route('/:article_id/comments')
  .get(fetchArticleComments)
  .post(sendArticleComment)
  .all(methodNotAllowed);

module.exports = articlesRouter;
