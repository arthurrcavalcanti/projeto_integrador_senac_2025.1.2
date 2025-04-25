const knex = require('knex')(require('../knexfile').development);

const getAll = () => knex('users').select('*');
const getById = (id) => knex('users').where({ id }).first();
const create = (data) => knex('users').insert(data);
const remove = (id) => knex('users').where({ id }).del();

module.exports = { getAll, getById, create, remove };
