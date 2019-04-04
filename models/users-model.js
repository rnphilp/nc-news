const connection = require('../db/connection');

exports.getUser = ({ username }) => {
  return connection('users')
    .select('username', 'avatar_url', 'name')
    .where({ username });
};
