const express = require("express");

// Controllers
const {
  addProductInCart,
  updateCart,
  deleteProduct,
  buyCart,
} = require("../controllers/cart.controllers");

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

const cartRouter = express.Router();
// Protecting below endpoints
cartRouter.use(protectSession);

cartRouter.post("/add-product", addProductInCart);
cartRouter.patch("/update-cart", updateCart);
cartRouter.delete("/:productId", deleteProduct);
cartRouter.post("/purchase", buyCart);

module.exports = { cartRouter };
