const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const Product = require("../../models/products.model");

module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query);
  const objectSearch = searchHelper(req.query);

  let find = {
    deleted: false,
  };

  if (req.query.status) {
    find.status = req.query.status;
  }
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  const products = await Product.find(find).limit(4);
  res.render("admin/pages/products/index.pug", {
    pageTitle: "Danh sách sản phẩm",
    products,
    filterStatus,
    keyword: objectSearch.keyword,
  });
};
