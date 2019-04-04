const connection = require('../db/connection');

exports.getArticleComments = ({ article_id }) => {
  return connection('comments')
    .select('comment_id', 'votes', 'created_at', 'author', 'body')
    .where({ article_id });
};
