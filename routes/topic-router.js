const topicRouter = require('express').Router();
const { fetchTopics } = require('../controllers/topics-controller');
const { methodNotAllowed } = require('../errors');

topicRouter
  .route('/')
  .get(fetchTopics)
  .all(methodNotAllowed);

module.exports = topicRouter;
