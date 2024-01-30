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

module.exports.createRecord = async (req, res) => {
  try {
    res.render("admin/pages/categories/create.pug", {
      pageTitle: "Thêm mới danh mục",
    });
  } catch (error) {
    res.flash("error", "Bạn không có quyền tạo danh mục mới!");
    console.log("error create category: ", error);
  }
};

module.exports.createRecordPost = async (req, res) => {
  try {
    const categories = new Categories(req.body);
    await categories.save();
    console.log(categories);
    req.flash("success", "Thêm thành công danh mục mới!");
  } catch (error) {
    res.flash("error", "Thêm mới danh mục thất bại!");
    console.log("error create category: ", error);
  } finally {
    res.redirect(`${systemConfig.prefixAdmin}/categories`);
  }
};
