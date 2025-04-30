const Review = require('../models/reviewModel');

exports.list = async (req, res) => {
  const reviews = await Review.getAll();
  res.json(reviews);
};

exports.listById = async (req, res) => {
  const { id } = req.params;
  console.log("Tentando pegar review com id " + id);
  const reviews = await Review.getById(id);
  res.json(reviews);
};

exports.listByBookId = async (req, res) => {
  const { id } = req.params;
  console.log("Tentando pegar reviews do livro com id " + id);
  const reviews = await Review.getByBookId(id);
  console.log("Reviews encontrados: ", {reviews});
  res.json(reviews);
};

exports.create = async (req, res) => {
  const { book_id, content, rating } = req.body;
  try {
    const [id] = await Review.create({ book_id, content, rating });
    res.status(201).json({ id, book_id, content, rating });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  await Review.remove(id);
  res.status(204).send();
};
