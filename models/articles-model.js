const connection = require('../db/connection');

exports.getArticles = ({
  author, topic, sort_by, order, article_id, limit, p,
}) => {
  const columns = ['author', 'title', 'article_id', 'topic', 'created_at', 'votes'];
  if (!columns.includes(sort_by)) sort_by = 'created_at';
  sort_by = `articles.${sort_by}`;

  if (order !== 'asc') order = 'desc';
  if (!+limit) limit = 10;
  if (!+p) p = 1;

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
    .orderBy(sort_by, order)
    .limit(limit)
    .offset((p - 1) * limit);

  if (author) query.where({ 'articles.author': author });
  if (topic) query.where({ 'articles.topic': topic });
  if (article_id) {
    query.where({ 'articles.article_id': article_id });
    query.select('articles.body');
  }
  return query;
};

exports.patchArticle = ({ article_id }, { inc_votes }) => {
  return connection('articles')
    .returning(['author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'body'])
    .increment({ votes: inc_votes })
    .where({ article_id });
};

exports.deleteArticle = ({ article_id }) => {
  return connection('articles')
    .returning('*')
    .where({ article_id })
    .del();
};
