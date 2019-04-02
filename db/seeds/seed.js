const {
  articles, comments, topics, users,
} = require('../data');
const {
  datesToSql,
  replaceKeys,
  createLookup,
  renameKeys,
} = require('../../utils/util-helpers');

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
      const articlesToAdd = datesToSql(articles, 'created_at');
      return knex
        .insert(articlesToAdd)
        .into('articles')
        .returning('*');
    })
    .then((articlesAdded) => {
      let commentsToAdd = datesToSql(comments, 'created_at');
      const lookup = createLookup(articlesAdded, 'title', 'article_id');
      commentsToAdd = replaceKeys(
        commentsToAdd,
        lookup,
        'belongs_to',
        'article_id',
      );
      commentsToAdd = renameKeys(commentsToAdd, 'created_by', 'author');
      return knex
        .insert(commentsToAdd)
        .into('comments')
        .returning('*');
    });
};
