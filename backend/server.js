require("./inicializaBanco.js"); // Inicializa o banco de dados

const express = require("express");
const cors = require("cors");

const userController = require("./controllers/userController");
const bookController = require("./controllers/bookController");
const reviewController = require("./controllers/reviewController");

const app = express();

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "DELETE", "PUT"],
  allowedHeaders: ["Content-Type"],
  credentials: false,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => res.send("Hello World"));

// USERS
app.get("/users", userController.list);
app.get("/users/:id/image", userController.getImage); // <-- Adicione esta linha
app.post("/users", userController.uploadImageMiddleware, userController.create);
app.put("/users", userController.uploadImageMiddleware, userController.update);
app.post("/users/login", userController.login);
app.delete("/users/:id", userController.delete);

// BOOKS
app.get("/books", bookController.findOrList);
app.post("/books", bookController.create);
app.delete("/books/:id", bookController.delete);

// REVIEWS
app.get("/reviews/:id", reviewController.listById);
app.get("/reviews/book/:id", reviewController.listByBookId);
app.post("/reviews", reviewController.create);
// Outros endpoints de livros, reviews, etc virão aqui...

app.listen(3000, "localhost", () => {
  // mensagens de console.log aqui aparecem no terminal;
  console.log("✅ Servidor rodando em http://localhost:3000");
});
