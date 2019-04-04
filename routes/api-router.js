const apiRouter = require('express').Router();
const topicsRouter = require('./topics-router');
const articlesRouter = require('./articles-router');
const commentsRouter = require('./comments-router');
const usersRouter = require('./users-router');
const { fetchApi } = require('../controllers/api-controller');
const { methodNotAllowed } = require('../errors');

apiRouter
  .route('/')
  .get(fetchApi)
  .all(methodNotAllowed);

apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;
