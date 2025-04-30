const knex = require('knex')(require('../knexfile').development);

const getAll = () => knex('books').select('*');
const getById = (id) => knex('books').where({ id }).first();
const create = (data) => knex('books').insert(data);
const remove = (id) => knex('books').where({ id }).del();

const getAverageRating = (book_id) => knex('reviews').where({ book_id }).avg('rating as averageRating').first()

const find = (search) => {
  return knex('books')
    .where('title', 'like', `%${search}%`)
    .orWhere('author', 'like', `%${search}%`)
    .orWhere('description', 'like', `%${search}%`)
    .orWhere('isbn', 'like', `%${search}%`);
};

module.exports = { getAll, getById, create, remove, find, getAverageRating };
