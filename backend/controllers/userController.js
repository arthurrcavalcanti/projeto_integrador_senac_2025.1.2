const User = require("../models/userModel");
const bcrypt = require("bcrypt");

exports.list = async (req, res) => {
  const users = await User.getAll();
  res.json(users);
};

exports.create = async (req, res) => {
  const { name, email, password } = req.body;
  console.log("Tentando criar usuario", { name, email });
  try {
    const existingUser = await User.getByEmail(email);
    if (existingUser)
      return res.status(400).json({ error: "Esse email já foi cadastrado" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const [id] = await User.create({ name, email, password: hashedPassword });

    console.log("Usuario criado com sucesso", { id, name, email });
    res.status(201).json({ id, name, email });
  } catch (err) {
    console.log("Falha ao criar usuário!", { err });
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  const { usuario } = req.body;
  console.log("Tentando atualizar usuário", { usuario });

  try {
    if (!usuario.id) {
      return res.status(400).json({ error: "ID do usuário é obrigatório" });
    }

    // Checando se email já foi tomado por outro usuário
    if (usuario.email) {
      const existingUser = await User.getByEmail(usuario.email);
      if (existingUser && existingUser.id !== usuario.id) {
        return res.status(400).json({ error: "Esse email já foi cadastrado" });
      }
    }

    const updateData = {
      name: usuario.name,
      email: usuario.email,
    };

    if (usuario.password) {
      updateData.password = await bcrypt.hash(usuario.password, 10);
    }

    // Run update
    await User.update(usuario.id, updateData);

    // Fetch updated user to return
    const updatedUser = await User.getById(usuario.id);

    console.log("Usuário atualizado com sucesso", updatedUser);
    res.status(200).json(updatedUser);
  } catch (err) {
    console.log("Falha ao atualizar usuário!", { err });
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Tentando logar usuario", { email });
  try {
    const user = await User.getByEmail(email);
    if (!user)
      return res.status(400).json({ error: "Email ou senha inválidos" });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return res.status(400).json({ error: "Email ou senha inválidos" });

    console.log("Usuário logado com sucesso!", { user });
    res.status(200).json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    console.log("Falha ao logar usuário!", { err });
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  await User.remove(id);
  res.status(204).send();
};
