const productRoutes = require("./product.route");
module.exports = (app) => {
  app.use("/products", productRoutes);
};
