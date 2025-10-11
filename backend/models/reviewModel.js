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

// Remove APENAS o id informado (sem tratar dependências)
const remove = (id) => knex("reviews").where({ id }).del();

// Remove review + comentários filhos + vínculos em userreviews
const removeCascade = async (id) => {
  return knex.transaction(async (trx) => {
    // filhos (comentários) desta review
    const childIds = await trx("reviews").where({ review_id: id }).pluck("id");

    if (childIds.length) {
      // vínculos userreviews dos filhos
      await trx("userreviews").whereIn("review_id", childIds).del();
      // apaga filhos
      await trx("reviews").whereIn("id", childIds).del();
    }

    // vínculo userreviews do pai
    await trx("userreviews").where({ review_id: id }).del();
    // apaga pai
    const deleted = await trx("reviews").where({ id }).del();
    return deleted;
  });
};

module.exports = {
  getAll,
  getById,
  create,
  remove,
  removeCascade,
  getByBookId,
};
