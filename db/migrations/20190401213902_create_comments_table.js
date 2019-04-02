exports.up = function (knex, Promise) {
  return knex.schema.createTable('comments', (comments) => {
    comments.increments('id').primary();
    comments
      .string('author')
      .notNullable()
      .references('users.username');
    comments
      .integer('article_id')
      .notNullable()
      .references('articles.article_id');
    comments
      .integer('votes')
      .notNullable()
      .defaultsTo(0);
    comments
      .date('created_at')
      .notNullable()
      .defaultTo(knex.fn.now());
    comments.text('body').notNullable();
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('comments');
};
