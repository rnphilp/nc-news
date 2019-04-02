const topicRouter = require('express').Router();
const { fetchTopics } = require('../controllers/topics-controller');

topicRouter.route('/').get(fetchTopics);

module.exports = topicRouter;
