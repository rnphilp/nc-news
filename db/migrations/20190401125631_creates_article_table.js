exports.up = function(knex, Promise) {
  return knex.schema.createTable('articles', articles => {
    articles.increments('article_id').primary();
    articles.string('title').notNullable();
    articles.text('body').notNullable();
    articles
      .integer('votes')
      .notNullable()
      .defaultTo(0);
    articles
      .string('topic')
      .references('topics.slug')
      .notNullable();
    articles
      .string('author')
      .references('users.username')
      .notNullable();
    articles
      .date('created_at')
      .notNullable()
      .defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('articles');
};
