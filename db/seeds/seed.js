const { articles, comments, topics, users } = require('../data');

exports.seed = (knex, Promise) => {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return knex
        .insert(topics)
        .into('topics')
        .returning('*');
    })
    .then(topics => {
      console.log(topics);
    });
};
