const Product = require("../../models/products.model");
const productsHelper = require("../../helpers/priceNew");

// [GET/client/]
module.exports.index = async (req, res) => {
  // lấy ra sản phẩm nổi bật
  const productsFeatured = await Product.find({
    featured: "1",
    deleted: false,
    status: "active",
  }).limit(8);

  const newProductsFeatured = productsHelper.priceNewProducts(productsFeatured);

  const productsNew = await Product.find({
    deleted: false,
    status: "active",
  }).limit(12);

  const products = productsHelper.priceNewProducts(productsNew);

  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    productsFeatured: newProductsFeatured,
    products: products,
  });
};
