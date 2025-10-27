const BookList = require('../models/bookListModel');

// Add a book to a user's list
exports.addToList = async (req, res) => {
  const { user_id, book_id, list_name } = req.body;
  
  if (!user_id || !book_id) {
    return res.status(400).json({ error: 'user_id and book_id are required' });
  }

  try {
    const exists = await BookList.isBookInList(user_id, book_id, list_name || 'default');
    if (exists) {
      return res.status(409).json({ error: 'Book already in this list' });
    }

    await BookList.addBookToList(user_id, book_id, list_name || 'default');
    res.status(201).json({ message: 'Book added to list', user_id, book_id, list_name: list_name || 'default' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all list names for a user
exports.getUserLists = async (req, res) => {
  const { user_id } = req.params;

  try {
    const lists = await BookList.getUserLists(user_id);
    res.json({ user_id, lists });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all books in a specific list
exports.getBooksInList = async (req, res) => {
  const { user_id, list_name } = req.params;

  try {
    const books = await BookList.getBooksInList(user_id, list_name);
    res.json({ user_id, list_name, books });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all books across all lists for a user
exports.getAllUserBooks = async (req, res) => {
  const { user_id } = req.params;

  try {
    const books = await BookList.getAllUserBooks(user_id);
    res.json({ user_id, books });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove a book from a user's list
exports.removeFromList = async (req, res) => {
  const { user_id, book_id, list_name } = req.params;

  try {
    await BookList.removeBookFromList(user_id, book_id, list_name);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
