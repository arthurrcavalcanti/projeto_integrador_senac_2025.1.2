const knex = require('knex')(require('../knexfile').development);

const getAll = () => knex('books').select('*');
const getById = (id) => knex('books').where({ id }).first();
const create = (data) => knex('books').insert(data);
const remove = (id) => knex('books').where({ id }).del();

module.exports = { getAll, getById, create, remove };
