const express = require("express");
const cors = require("cors");
const knex = require("knex")(require("./knexfile").development);

const userController = require("./controllers/userController");
const bookController = require("./controllers/bookController");
const reviewController = require("./controllers/reviewController");
const bookListController = require("./controllers/bookListController");
const bookLikeController = require("./controllers/bookLikeController");

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
app.delete("/reviews/:id", reviewController.delete);

// BOOK LISTS
app.post("/lists", bookListController.addToList);
app.get("/lists/user/:user_id", bookListController.getUserLists);
app.get("/lists/user/:user_id/all", bookListController.getAllUserBooks);
app.get("/lists/user/:user_id/:list_name", bookListController.getBooksInList);
app.delete("/lists/user/:user_id/book/:book_id/:list_name", bookListController.removeFromList);

// BOOK LIKES
app.post("/likes", bookLikeController.likeBook);
app.delete("/likes/user/:user_id/book/:book_id", bookLikeController.unlikeBook);
app.get("/likes/user/:user_id/book/:book_id", bookLikeController.hasLiked);
app.get("/likes/user/:user_id", bookLikeController.getLikedBooks);
app.get("/likes/book/:book_id/count", bookLikeController.getLikeCount);
app.get("/suggestions/user/:user_id", bookLikeController.getSuggestions);

// Run migrations and start server
async function startServer() {
  try {
    console.log("🔄 Executando migrações...");
    await knex.migrate.latest();
    console.log("✅ Migrações aplicadas com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao executar migrações:", error.message);
    process.exit(1);
  }

  app.listen(3000, "localhost", () => {
    console.log("✅ Servidor rodando em http://localhost:3000");
  });
}

startServer();
