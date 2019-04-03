const connection = require('../db/connection');

exports.getArticles = ({ username, topic }) => {
  const query = connection('articles')
    .select(
      'articles.author',
      'articles.title',
      'articles.article_id',
      'articles.topic',
      'articles.created_at',
      'articles.votes',
    )
    .count('comments.article_id AS comment_count')
    .leftJoin('comments', 'comments.article_id', '=', 'articles.article_id')
    .groupBy('articles.article_id')
    .orderBy('articles.created_at', 'desc');

  if (username) query.where({ 'articles.author': username });
  if (topic) query.where({ 'articles.topic': topic });

  return query;
};
