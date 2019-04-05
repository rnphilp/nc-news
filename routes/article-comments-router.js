const articleCommentsRouter = require('express').Router({ mergeParams: true });
const {
  fetchArticleComments,
  sendArticleComment,
} = require('../controllers/article-comments-controller');
const { methodNotAllowed } = require('../errors');

articleCommentsRouter
  .route('/')
  .get(fetchArticleComments)
  .post(sendArticleComment)
  .all(methodNotAllowed);

module.exports = articleCommentsRouter;
