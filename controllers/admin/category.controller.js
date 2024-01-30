const Categories = require("../../models/category.model");
const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");

module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query);
  const objectSearch = searchHelper(req.query);
  const find = {
    deleted: false,
    ...(req.query.status && { status: req.query.status }),
    ...(objectSearch.regex && { title: objectSearch.regex }),
  };
  const categories = await Categories.find(find);
  res.render("admin/pages/categories/index.pug", {
    pageTitle: "Danh sách danh mục",
    categories,
    filterStatus,
  });
};
