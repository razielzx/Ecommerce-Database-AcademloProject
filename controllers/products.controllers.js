const { Categorie } = require("../models/categorie.model");
const { Product } = require("../models/product.model");
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");
const {uploadProductImgs} = require('../utils/firebase.util')

const getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.findAll({ where: { status: "active" } });

  res.status(200).json({
    status: "success",
    data: {
      products,
    },
  });
});

const getProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findOne({ where: { id, status: "active" } });

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

const getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Categorie.findAll({ where: { status: "active" } });

  res.status(200).json({
    status: "success",
    data: {
      categories,
    },
  });
});
const createCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  const category = await Categorie.create({ name });

  if (!category) {
    return next(new AppError("error creating category", 400));
  }
  res.status(200).json({
    status: "succes",
    data: {
      category,
    },
  });
});

const createProduct = catchAsync(async (req, res, next) => {
  const { title, description, categoryId, userId, price, quantity } = req.body;
  const product = await Product.create({
    title,
    description,
    categoryId,
    userId,
    price,
    quantity,
  });

  if (!product) {
    return next(new AppError("Error creating product", 400));
  }
  uploadProductImgs(req.file, product.id)

  res.status(200).json({
    status: "succes",
    data: {
      product,
    },
  });
});
const updateProduct = catchAsync(async (req, res, next) => {
  const { title, description, price, quantity } = req.body;
  const { id } = req.params;
  console.log(id);

  const product = await Product.findOne({ where: { id } });

  if (!product) {
    return next(new AppError("Error product no found", 400));
  }
  await product.update({ title, description, price, quantity });

  res.status(200).json({
    status: "success",
    data: { product },
  });
});

const deleteProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findOne({ where: { id } });

  await product.update({ status: "deleted" });

  res.status(204).json({ status: "success" });
});

const updateCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;

  const category = await Categorie.findOne({ where: { id } });

  if (!category) {
    return next(new AppError("Error category no found", 400));
  }
  await category.update({ name });

  res.status(200).json({
    status: "success",
    data: { category },
  });
});

module.exports = {
  createCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  updateCategory,
  getAllProducts,
  getProduct,
  getAllCategories,
};
