const knex = require("knex")(require("../knexfile").development);

const getAll = () => knex("users").select("*");
const getById = (id) => knex("users").where({ id }).first();
const getByEmail = (email) => knex("users").where({ email }).first();
const create = (data) => knex("users").insert(data);
const update = (id, data) => knex("users").where({ id }).update(data);
const remove = (id) => knex("users").where({ id }).del();

const addUserReview = (user_id, review_id) =>
  knex("userreviews").insert({ user_id, review_id });

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  getByEmail,
  addUserReview,
};
