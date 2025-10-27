const knex = require("knex")(require("../knexfile").development);

// Like a book
const likeBook = (user_id, book_id) => {
  return knex("booklikes").insert({ user_id, book_id });
};

// Unlike a book
const unlikeBook = (user_id, book_id) => {
  return knex("booklikes").where({ user_id, book_id }).del();
};

// Check if a user has liked a book
const hasLikedBook = (user_id, book_id) => {
  return knex("booklikes")
    .where({ user_id, book_id })
    .first()
    .then((row) => !!row);
};

// Get all books liked by a user
const getLikedBooks = (user_id) => {
  return knex("booklikes")
    .join("books", "booklikes.book_id", "books.id")
    .where({ user_id })
    .select("books.*", "booklikes.liked_at");
};

// Get book suggestions based on user's likes
// Uses collaborative filtering: finds users with similar taste and recommends their books
// The more books in common, the stronger the recommendation
const getSuggestedBooks = async (user_id, limit = 10) => {
  // Get all books the current user has liked
  const userLikedBooks = await knex("booklikes")
    .where({ user_id })
    .select("book_id");

  if (userLikedBooks.length === 0) {
    // No likes yet, return popular books
    return knex("books")
      .leftJoin("booklikes", "books.id", "booklikes.book_id")
      .groupBy("books.id")
      .select("books.*")
      .count("booklikes.id as like_count")
      .orderBy("like_count", "desc")
      .limit(limit);
  }

  const userBookIds = userLikedBooks.map((b) => b.book_id);

  // Encotra usuário que gostaram dos mesmos livros que o usuário atual
  // conta quantos livros eles têm em comum (pontuação de similaridade)
  const similarUsers = await knex("booklikes as bl1")
    .join("booklikes as bl2", "bl1.book_id", "bl2.book_id")
    .where("bl1.user_id", user_id)
    .where("bl2.user_id", "!=", user_id)
    .groupBy("bl2.user_id")
    .select("bl2.user_id")
    .count("* as common_likes")
    .orderBy("common_likes", "desc")
    .limit(10);

  if (similarUsers.length === 0) {
    // Se não houver usuários semelhantes, recomendar livros do mesmo autor dos livros curtidos pelo usuário
    // por enquanto só temos os autores para essa distinção
    const userBooks = await knex("books")
      .whereIn("id", userBookIds)
      .select("author");

    const authors = [
      ...new Set(userBooks.map((b) => b.author).filter(Boolean)),
    ];

    if (authors.length === 0) {
      // Retorna livros populares se não houver autores válidos
      return knex("books")
        .leftJoin("booklikes", "books.id", "booklikes.book_id")
        .groupBy("books.id")
        .select("books.*")
        .count("booklikes.id as like_count")
        .orderBy("like_count", "desc")
        .limit(limit);
    }

    return knex("books")
      .whereIn("author", authors)
      .whereNotIn("id", userBookIds)
      .limit(limit);
  }

  // Retorna os livros curtidos por usuários semelhantes que o usuário atual ainda não curtiu
  // Quanto mais em comum, maior a pontuação de recomendação
  const suggestions = await knex("booklikes")
    .join("books", "booklikes.book_id", "books.id")
    .join(
      knex.raw("(?) as similar_users", [
        knex("booklikes as bl1")
          .join("booklikes as bl2", "bl1.book_id", "bl2.book_id")
          .where("bl1.user_id", user_id)
          .where("bl2.user_id", "!=", user_id)
          .groupBy("bl2.user_id")
          .select("bl2.user_id", knex.raw("count(*) as common_likes")),
      ]),
      "booklikes.user_id",
      "similar_users.user_id"
    )
    .whereNotIn("booklikes.book_id", userBookIds)
    .groupBy("booklikes.book_id")
    .select(
      "books.*",
      knex.raw("sum(similar_users.common_likes) as recommendation_score")
    )
    .orderBy("recommendation_score", "desc")
    .limit(limit);

  return suggestions;
};

// Pega a contagem de likes de um livro
const getLikeCount = (book_id) => {
  return knex("booklikes")
    .where({ book_id })
    .count("* as count")
    .first()
    .then((row) => row.count);
};

module.exports = {
  likeBook,
  unlikeBook,
  hasLikedBook,
  getLikedBooks,
  getSuggestedBooks,
  getLikeCount,
};
