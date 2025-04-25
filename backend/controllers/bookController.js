const Book = require('../models/bookModel');

// exports.list = async (req, res) => {
//   const books = await Book.getAll();
//   res.json(books);
// };

// exports.find = async(req, res) => {
//   const { search } = req.query;
//   const books = await Book.find(search);
//   res.json(books);
// }

exports.findOrList = async (req, res) => {
  const { search } = req.query;
  try {
    const books = search
      ? await Book.find(search)
      : await Book.getAll();

    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar livros' });
  }
};

exports.create = async (req, res) => {
  const { title, author, description, isbn, cover } = req.body;
  try {
    console.log(`Tentando criar livro: ${title}`);
    const [id] = await Book.create({ title, author, description, isbn, cover  });
    console.log(`Livro: ${title} criado com sucesso!`);
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
