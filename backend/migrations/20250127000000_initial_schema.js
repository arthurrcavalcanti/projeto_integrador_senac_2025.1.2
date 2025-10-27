exports.up = function(knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.increments('id').primary();
      table.text('name').notNullable();
      table.text('email').unique().notNullable();
      table.text('password').notNullable();
    })
    .createTable('books', (table) => {
      table.increments('id').primary();
      table.text('title').notNullable();
      table.text('author').notNullable();
      table.text('description');
      table.text('isbn').unique();
      table.text('cover');
    })
    .createTable('userbooks', (table) => {
      table.increments('id').primary();
      table.integer('user_id').references('id').inTable('users');
      table.integer('book_id').references('id').inTable('books');
    })
    .createTable('reviews', (table) => {
      table.increments('id').primary();
      table.integer('review_id').nullable().references('id').inTable('reviews');
      table.integer('book_id').notNullable().references('id').inTable('books');
      table.text('content');
      table.integer('rating').checkBetween([1, 5]);
    })
    .createTable('userreviews', (table) => {
      table.increments('id').primary();
      table.integer('user_id').notNullable().references('id').inTable('users');
      table.integer('review_id').notNullable().references('id').inTable('reviews');
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('userreviews')
    .dropTableIfExists('reviews')
    .dropTableIfExists('userbooks')
    .dropTableIfExists('books')
    .dropTableIfExists('users');
};
