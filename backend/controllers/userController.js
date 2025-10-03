const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const multer = require("multer");

// Configuração do multer para armazenar o arquivo em memória
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware para upload de imagem
exports.uploadImageMiddleware = upload.single("image");

exports.list = async (req, res) => {
  const users = await User.getAll();
  res.json(users);
};

exports.getImage = async (req, res) => {
  const { id } = req.params;
  const user = await User.getById(id);
  if (user && user.image) {
    res.set("Content-Type", "image/png"); // ajuste o tipo se necessário
    res.send(user.image);
  } else {
    res.status(404).send();
  }
};

exports.create = async (req, res) => {
  const { name, email, password } = req.body;
  let imageBuffer = null;
  if (req.file) {
    imageBuffer = req.file.buffer;
  }
  console.log("Tentando criar usuario", { name, email });
  try {
    const existingUser = await User.getByEmail(email);
    if (existingUser)
      return res.status(400).json({ error: "Esse email já foi cadastrado" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const [id] = await User.create({
      name,
      email,
      password: hashedPassword,
      image: imageBuffer,
    });

    console.log("Usuario criado com sucesso", { id, name, email });
    res.status(201).json({ id, name, email });
  } catch (err) {
    console.log("Falha ao criar usuário!", { err });
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  // Pegue os campos diretamente de req.body
  const { id, name, email, password } = req.body;
  let imageBuffer = null;
  if (req.file) {
    imageBuffer = req.file.buffer;
  }
  console.log("Tentando atualizar usuário", { id, name, email });

  try {
    if (!id) {
      return res.status(400).json({ error: "ID do usuário é obrigatório" });
    }

    // Checando se email já foi tomado por outro usuário
    if (email) {
      const existingUser = await User.getByEmail(email);
      if (existingUser && existingUser.id !== Number(id)) {
        return res.status(400).json({ error: "Esse email já foi cadastrado" });
      }
    }

    const updateData = {
      name,
      email,
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    if (imageBuffer) {
      updateData.image = imageBuffer;
    }

    await User.update(id, updateData);

    const updatedUser = await User.getById(id);

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
