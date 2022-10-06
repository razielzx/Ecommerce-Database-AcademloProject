const { Cart } = require("../models/cart.model");
const { Order } = require("../models/order.model");
const { Product } = require("../models/product.model");
const { ProductsInCart } = require("../models/productsInCart.model");
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");

const addProductInCart = catchAsync(async (req, res, next) => {
  const { id } = req.sessionUser;
  const { quantity, productId } = req.body;

  const count = await Product.findOne({ where: { id: productId } });

  if (!count) {
    return next(new AppError("Product no found", 400));
  }

  if (count.quantity < quantity) {
    return next(new AppError("larger quantity than available", 400));
  }

  const cart = await Cart.findOne({ where: { userId: id, status: "active" } });

  if (!cart) {
    cartC = await Cart.create({ userId: id });

    if (!cartC) {
      return next(new AppError("error creating cart", 400));
    }
  }
  const productIncart = await ProductsInCart.findOne({
    where: { cartId: cart.id, productId },
  });

  if (productIncart) {
    if (productIncart.status === "removed") {
      await productIncart.update({ status: "active", quantity });
    }
    return next(new AppError("product is already in the cart ", 400));
  }
  productInCartF = await ProductsInCart.create({
    quantity,
    productId,
    cartId: cart.id,
  });
  res.status(200).json({
    status: "success",
    data: {
      productInCartF,
    },
  });
});

const updateCart = catchAsync(async (req, res, next) => {
  const { productId, newQty } = req.body;
  const { id } = req.sessionUser;

  const cart = await Cart.findOne({ where: { userId: id, status: "active" } });

  const product = await ProductsInCart.findOne({
    where: { cartId: cart.id, productId },
  });
  if (!product) {
    return next(new AppError("nada", 400));
  }
  
  if (product.quantity < newQty)
    return next(new AppError("larger quantity than available", 400));

  if (newQty <= 0) {
    return await product.update({ status: "removed" });
  }
  await product.update({ quantity: newQty });

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

const deleteProduct = catchAsync(async (req, res, next) => {
  const { id } = req.sessionUser;
  const { productId } = req.params;

  const cart = await Cart.findOne({ where: { userId: id, status: "active" } });

  const productIncart = await ProductsInCart.findOne({
    where: { cartId: cart.id, productId },
  });

  await productIncart.update({
    quantity: 0,
    status: "removed",
  });

  res.status(200).json({
    status: "succes",
    data: {
      productIncart,
    },
  });
});

const buyCart = catchAsync(async (req, res, next) => {
  const { id } = req.sessionUser;

  const products = await Product.findAll({ where: { status: "active" } });

  let coundQuantity = 0;
  let total = 0;
  const cart = await Cart.findOne({
    where: { userId: id, status: "active" },
    include: [{ model: ProductsInCart, where: { status: "active" } }],
  });
  const productsInCart = await ProductsInCart.findAll({});

  const productsBuy = productsInCart.map((productCart) =>
    products.map(async (product) => {
      product.id === productCart.productId;
      coundQuantity = product.quantity - productCart.quantity;
      total = total + productCart.quantity * product.price;
      await product.update({ quantity: coundQuantity });
      await productCart.update({ status: "purchased" });
    })
  );
  await cart.update({ status: "purchased" });
  await Order.create({ userId: id, cartId: cart.id, totalPrice: total });

  res.status(200).json({
    status: "success",
    message: "purchased",
  });
});

module.exports = {
  addProductInCart,
  updateCart,
  deleteProduct,
  buyCart,
};
