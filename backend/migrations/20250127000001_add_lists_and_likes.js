exports.up = function(knex) {
  return knex.schema
    .table('userbooks', (table) => {
      table.text('list_name').defaultTo('default');
      table.timestamp('added_at').defaultTo(knex.fn.now());
    })
    .createTable('booklikes', (table) => {
      table.increments('id').primary();
      table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.integer('book_id').notNullable().references('id').inTable('books').onDelete('CASCADE');
      table.timestamp('liked_at').defaultTo(knex.fn.now());
      table.unique(['user_id', 'book_id']);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('booklikes')
    .table('userbooks', (table) => {
      table.dropColumn('list_name');
      table.dropColumn('added_at');
    });
};
