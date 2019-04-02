const { articles, comments, topics, users } = require('../data');
const {
  objDateToSql,
  replaceKey,
  createLookup,
  renameKeys
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
      const articlesToAdd = objDateToSql(articles, 'created_at');
      return knex
        .insert(articlesToAdd)
        .into('articles')
        .returning('*');
    })
    .then(articlesAdded => {
      let commentsToAdd = objDateToSql(comments, 'created_at');
      // TODO: convert article name to article id
      const lookup = createLookup(articlesAdded, 'title', 'article_id');
      commentsToAdd = replaceKey(
        commentsToAdd,
        lookup,
        'belongs_to',
        'article_id'
      );
      commentsToAdd = renameKeys(commentsToAdd, 'created_by', 'author');
      return knex
        .insert(commentsToAdd)
        .into('comments')
        .returning('*');
    });
};
