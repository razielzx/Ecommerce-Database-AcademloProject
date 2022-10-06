// Models
const { User } = require("./user.model");
const { Categorie } = require("./categorie.model");
const { Cart } = require("./cart.model");
const { Order } = require("./order.model");
const { Product } = require("./product.model");
const { ProductImg } = require("./productImg.model");
const { ProductsInCart } = require("./productsInCart.model");

const initModels = () => {
  //  1 - 1
  Product.hasOne(Categorie, { foreignKey: "categoryId" });
  Categorie.belongsTo(Product);

  User.hasOne(Cart, { foreignKey: "userId" });
  Cart.belongsTo(User);

  Cart.hasOne(Order, { foreignKey: "cartId" });
  Order.belongsTo(Cart);

  // 1 - M
  User.hasMany(Order, { foreignKey: "userId" });
  Order.belongsTo(User);

  User.hasMany(Product, { foreignKey: "userId" });
  Product.belongsTo(User);

  Cart.hasMany(ProductsInCart, { foreignKey: "cartId" });
  ProductsInCart.belongsTo(Cart);

  Product.hasMany(ProductImg, { foreignKey: "productId" });
  ProductImg.belongsTo(Product);

  ProductsInCart.hasMany(ProductImg, { foreignKey: "productId" });
  ProductImg.belongsTo(ProductsInCart);
};

module.exports = { initModels };
