const knex = require('knex')(require('../knexfile').development);

const getAll = () => knex('reviews').select('*');
const getById = (id) => knex('reviews').where({ id }).first();
const getByBookId = (book_id) => knex('reviews').where({ book_id });
const create = (data) => knex('reviews').insert(data);
const remove = (id) => knex('reviews').where({ id }).del();

module.exports = { getAll, getById, create, remove, getByBookId };
