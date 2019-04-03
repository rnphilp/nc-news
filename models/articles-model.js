const connection = require('../db/connection');

exports.getArticles = ({ username, topic, sort_by }) => {
  // const columns = ['author', 'title', 'article_id', 'topic', 'created_at', 'votes'];
  // if (!columns.includes(sort_by)) sort_by = 'created_at';
  if (!sort_by) sort_by = 'created_at';
  sort_by = `articles.${sort_by}`;
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
    .orderBy(sort_by, 'desc');

  if (username) query.where({ 'articles.author': username });
  if (topic) query.where({ 'articles.topic': topic });
  return query;
};
