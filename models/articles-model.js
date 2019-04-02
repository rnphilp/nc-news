const connection = require('../db/connection');

exports.getArticles = () => {
  return connection('articles').select('title', 'article_id', 'topic', 'created_at', 'votes');
};
