const knex = require("knex")(require("../knexfile").development);

const addBookToList = (user_id, book_id, list_name = "default") => {
  return knex("userbooks").insert({ user_id, book_id, list_name });
};

const getUserLists = (user_id) => {
  return knex("userbooks")
    .where({ user_id })
    .distinct("list_name")
    .select("list_name")
    .then((rows) => rows.map((r) => r.list_name));
};

const getBooksInList = (user_id, list_name) => {
  return knex("userbooks")
    .join("books", "userbooks.book_id", "books.id")
    .where({ user_id, list_name })
    .select("books.*", "userbooks.added_at", "userbooks.list_name");
};

const getAllUserBooks = (user_id) => {
  return knex("userbooks")
    .join("books", "userbooks.book_id", "books.id")
    .where({ user_id })
    .select("books.*", "userbooks.added_at", "userbooks.list_name");
};

const removeBookFromList = (user_id, book_id, list_name) => {
  return knex("userbooks").where({ user_id, book_id, list_name }).del();
};

const isBookInList = (user_id, book_id, list_name) => {
  return knex("userbooks")
    .where({ user_id, book_id, list_name })
    .first()
    .then((row) => !!row);
};

module.exports = {
  addBookToList,
  getUserLists,
  getBooksInList,
  getAllUserBooks,
  removeBookFromList,
  isBookInList,
};
