const connection = require('../db/connection');

exports.patchComment = ({ comment_id }, { inc_votes }) => {
  return connection('comments')
    .returning('*')
    .increment({ votes: inc_votes })
    .where({ comment_id });
};
