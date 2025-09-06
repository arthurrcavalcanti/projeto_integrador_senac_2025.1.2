const knex = require("knex")(require("../knexfile").development);

const getAll = () => knex("reviews").select("*");
const getById = (id) => knex("reviews").where({ id }).first();
const getByBookId = (book_id) => {
  return knex("reviews")
    .join("userreviews", "reviews.id", "userreviews.review_id")
    .join("users", "userreviews.user_id", "users.id")
    .leftJoin(
      "reviews as parent_reviews",
      "reviews.review_id",
      "parent_reviews.id"
    )
    .select(
      "reviews.*",
      "users.id as user_id",
      "users.name as user_name",
      "users.email as user_email"
    )
    .where("reviews.book_id", book_id);
};
const create = (data) => knex("reviews").insert(data);
const remove = (id) => knex("reviews").where({ id }).del();

module.exports = { getAll, getById, create, remove, getByBookId };
