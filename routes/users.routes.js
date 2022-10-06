const express = require("express");

// Controllers
const {
  getAllProductsByUser,
  createUser,
  updateUser,
  deleteUser,
  login,
  getBuysById,
  getAllBuys,
} = require("../controllers/users.controller");

// Middlewares
const { userExists } = require("../middlewares/users.middlewares");
const {
  protectSession,
  protectUsersAccount,
  protectAdmin,
} = require("../middlewares/auth.middlewares");
const {
  createUserValidators,
} = require("../middlewares/validators.middlewares");

const usersRouter = express.Router();

usersRouter.post("/", createUserValidators, createUser);

usersRouter.post("/login", login);

// Protecting below endpoints
usersRouter.use(protectSession);

usersRouter.get("/me", getAllProductsByUser);

usersRouter.patch("/:id", userExists, protectUsersAccount, updateUser);

usersRouter.delete("/:id", userExists, protectUsersAccount, deleteUser);

usersRouter.get("/orders", getAllBuys);

usersRouter.get("/orders/:id", getBuysById);

module.exports = { usersRouter };
