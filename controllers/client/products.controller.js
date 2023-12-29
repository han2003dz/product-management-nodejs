const Product = require("../../models/products.model");

module.exports.index = async (req, res) => {
  const listProduct = await Product.find({
    deleted: false,
    status: "active",
  });
  const products = listProduct.map((item) => {
    item.priceNew = (
      (item.price * (100 - item.discountPercentage)) /
      100
    ).toFixed(0);
    return item;
  });
  res.render("client/pages/products/index.pug", {
    pageTitle: "Trang sản phẩm",
    products: products,
  });
};
