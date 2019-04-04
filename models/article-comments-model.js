const connection = require('../db/connection');

exports.getArticleComments = ({ article_id }, { sort_by, order }) => {
  const validColumns = ['comment_id', 'votes', 'created_at'];
  if (!validColumns.includes(sort_by)) sort_by = 'created_at';
  if (order !== 'asc') order = 'desc';
  return connection('comments')
    .select('comment_id', 'votes', 'created_at', 'author', 'body')
    .where({ article_id })
    .orderBy(sort_by, order);
};
