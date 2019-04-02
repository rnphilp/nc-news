const articlesRouter = require('express').Router();
const { fetchArticles } = require('../controllers/articles-controller');

articlesRouter.route('/').get(fetchArticles);

module.exports = articlesRouter;
