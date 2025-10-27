const BookLike = require("../models/bookLikeModel");

exports.likeBook = async (req, res) => {
  const { user_id, book_id } = req.body;

  if (!user_id || !book_id) {
    return res.status(400).json({ error: "user_id and book_id are required" });
  }

  try {
    const hasLiked = await BookLike.hasLikedBook(user_id, book_id);
    if (hasLiked) {
      return res.status(409).json({ error: "Book already liked" });
    }

    await BookLike.likeBook(user_id, book_id);
    res.status(201).json({ message: "Book liked", user_id, book_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.unlikeBook = async (req, res) => {
  const { user_id, book_id } = req.params;

  try {
    await BookLike.unlikeBook(user_id, book_id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.hasLiked = async (req, res) => {
  const { user_id, book_id } = req.params;

  try {
    const hasLiked = await BookLike.hasLikedBook(user_id, book_id);
    res.json({ user_id, book_id, hasLiked });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLikedBooks = async (req, res) => {
  const { user_id } = req.params;

  try {
    const books = await BookLike.getLikedBooks(user_id);
    res.json({ user_id, books });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSuggestions = async (req, res) => {
  const { user_id } = req.params;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const suggestions = await BookLike.getSuggestedBooks(user_id, limit);
    res.json({ user_id, suggestions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLikeCount = async (req, res) => {
  const { book_id } = req.params;

  try {
    const count = await BookLike.getLikeCount(book_id);
    res.json({ book_id, like_count: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
