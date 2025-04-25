const Book = require('../models/bookModel');

exports.list = async (req, res) => {
  const books = await Book.getAll();
  res.json(books);
};

exports.create = async (req, res) => {
  const { title, author, description, isbn, cover } = req.body;
  try {
    console.log(`Tentando criar livro: ${title}`);
    const [id] = await Book.create({ title, author, description, isbn, cover  });
    res.status(201).json({ id, title, author, description, isbn  });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  await Book.remove(id);
  res.status(204).send();
};
