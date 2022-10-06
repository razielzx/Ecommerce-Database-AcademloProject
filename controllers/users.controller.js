const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Models
const { User } = require("../models/user.model");
const { Order } = require("../models/order.model");

// Utils
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");
const { ProductsInCart } = require("../models/productsInCart.model");
const { Cart } = require("../models/cart.model");

dotenv.config({ path: "./config.env" });

// Gen random jwt signs
// require('crypto').randomBytes(64).toString('hex') -> Enter into the node console and paste the command

const getAllProductsByUser = catchAsync(async (req, res, next) => {
  const { id } = req.sessionUser;
  const products = await ProductsInCart.findAll({
    where: { id, status: "active" },
  });

  res.status(200).json({
    status: "success",
    data: { products },
  });
});

const createUser = catchAsync(async (req, res, next) => {
  const { userName, email, password, role } = req.body;

  if (role !== "admin" && role !== "normal") {
    return next(new AppError("Invalid role", 400));
  }

  // Encrypt the password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    userName,
    email,
    password: hashedPassword,
    role,
  });

  // Remove password from response
  // newUser.password = undefined;

  // 201 -> Success and a resource has been created
  res.status(201).json({
    status: "success",
    message: "welcome",
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  const { userName } = req.body;
  const { user } = req;

  await user.update({ userName });

  res.status(200).json({
    status: "success",
    data: { user },
  });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: "deleted" });

  res.status(204).json({ status: "success" });
});

const login = catchAsync(async (req, res, next) => {
  // Get email and password from req.body
  const { email, password } = req.body;

  // Validate if the user exist with given email
  const user = await User.findOne({
    where: { email, status: "active" },
  });

  // Compare passwords (entered password vs db password)
  // If user doesn't exists or passwords doesn't match, send error
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Wrong credentials", 400));
  }

  // Remove password from response
  user.password = undefined;

  // Generate JWT (payload, secretOrPrivateKey, options)
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.status(200).json({
    status: "success",
    data: { user, token },
  });
});
const getAllOrders = catchAsync(async (req, res, next) => {
  const { id } = req.sessionUser;

  const orders = await Order.findAll({
    where: { userId: id },
    include: [
      {
        model: Cart,
        include: { model: ProductsInCart, where: { status: "purchased" } },
      },
    ],
  });

  if (!orders) {
    return next(new AppError("user no have order", 400));
  }
});

const getAllBuys = catchAsync(async (req, res, next) => {
  const buys = await Order.findAll({});

  res.status(200).json({
    status: "success",
    data: { buys },
  });
});
const getBuysById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const buy = await Order.findOne({ id });

  if (!buy) {
    return next(new AppError("order no found ", 400));
  }
  
  res.status(200).json({
    status: "success",
    data: { buy },
  });
});

module.exports = {
  getAllProductsByUser,
  createUser,
  updateUser,
  deleteUser,
  login,
  getBuysById ,
  getAllBuys
};
