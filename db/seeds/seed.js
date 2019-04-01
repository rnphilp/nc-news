const { articles, comments, topics, users } = require('../data');
const { objDateToSql } = require('../../utils/util-helpers');

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
    .then(() => {
      return knex
        .insert(users)
        .into('users')
        .returning('*');
    })
    .then(() => {
      const articlesToAdd = objDateToSql(articles, 'created_at');
      return knex
        .insert(articlesToAdd)
        .into('articles')
        .returning('*');
    })
    .then(articles => {});
};
