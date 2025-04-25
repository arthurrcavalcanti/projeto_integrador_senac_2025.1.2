const User = require('../models/userModel');

exports.list = async (req, res) => {
  const users = await User.getAll();
  res.json(users);
};

exports.create = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const [id] = await User.create({ name, email, password });
    res.status(201).json({ id, name, email });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  await User.remove(id);
  res.status(204).send();
};
