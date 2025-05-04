const Review = require('../models/reviewModel');
const User = require('../models/userModel');
const knex = require('knex')(require('../knexfile').development);

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

  try {
    const reviews = await Review.getByBookId(id);

    // Formatando usuário e review
    const reviewsWithUser = reviews.map(review => {
      const { user_id, user_name, user_email, ...rest } = review;
      return {
        ...rest,
        user: {
          id: user_id,
          name: user_name,
          email: user_email
        }
      };
    });

    console.log("Reviews encontrados: ", { reviewsWithUser, reviews });

    if(!reviewsWithUser || reviewsWithUser?.length == 0) {
      return res.json(reviews);
    }

    return res.json(reviewsWithUser);
  } catch (err) {
    console.error("Erro ao buscar reviews:", err);
    return res.status(500).json({ error: "Erro ao buscar reviews" });
  }
};


exports.create = async (req, res) => {
  const { book_id, content, rating, user_id } = req.body;
  try {
    const user = await User.getById(user_id);
    if(!user) return res.status(400).json({ error: 'Usuário não encontrado' });

    const [id] = await Review.create({ book_id, content, rating });
    await User.addUserReview(user_id, id);
    res.status(201).json({ id, book_id, content, rating, user_id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  await Review.remove(id);
  res.status(204).send();
};
