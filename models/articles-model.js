const connection = require('../db/connection');

exports.getArticles = () => {
  return connection('articles').select(
    'author',
    'title',
    'article_id',
    'topic',
    'created_at',
    'votes',
  );
};
