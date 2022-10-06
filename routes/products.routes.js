const express = require("express");

// Controllers
const {
  createCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  updateCategory,
  getAllProducts,
  getProduct,
  getAllCategories,
} = require("../controllers/products.controllers");

// Middlewares
const { userExists } = require("../middlewares/users.middlewares");

const {
  protectSession,
  protectUsersAccount,
  protectAdmin,
} = require("../middlewares/auth.middlewares");
const {
  createCategoryValidators,
  createProductValidators,
} = require("../middlewares/validators.middlewares");
const {upload} = require('../utils/multer.util')

const productsRouter = express.Router();

productsRouter.get("/", getAllProducts);
productsRouter.get("/:id", getProduct);
productsRouter.get("/categories", getAllCategories);

// Protecting below endpoints
productsRouter.use(protectSession);

productsRouter.patch("/categories/:id", protectUsersAccount, updateCategory);

productsRouter.post("/categories", createCategoryValidators, createCategory);

productsRouter.post(
  "/",
  upload.array("productImgs", 5),
  createProductValidators,
  createProduct
);

productsRouter.patch("/:id", protectUsersAccount, updateProduct);

productsRouter.delete("/:id", protectUsersAccount, deleteProduct);

module.exports = { productsRouter };
