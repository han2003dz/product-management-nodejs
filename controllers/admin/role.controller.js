const Role = require("../../models/role.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");

module.exports.index = async (req, res) => {
  try {
    const filterStatus = filterStatusHelper(req.query);
    const objectSearch = searchHelper(req.query);
    const find = {
      deleted: false,
      ...(req.query.status && { status: req.query.status }),
      ...(objectSearch.regex && { title: objectSearch.regex }),
    };
    const roles = await Role.find(find);

    res.render("admin/pages/roles/index.pug", {
      pageTile: "Danh sách quyền",
      roles,
      filterStatus,
      keyword: objectSearch.keyword,
    });
  } catch (error) {
    console.log("error: ", error);
    req.flash("error", "Không có quyền truy cập!");
  }
};

module.exports.create = async (req, res) => {
  try {
    res.render("admin/pages/roles/create", {
      pageTitle: "Thêm quyền",
    });
  } catch (error) {
    req.flash("error", "Không có quyền truy cập!");
    console.log("error: ", error);
  }
};

module.exports.createPost = async (req, res) => {
  try {
    const role = new Role(req.body);
    await role.save();
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
    req.flash("success", "Thêm thành công");
  } catch (error) {
    req.flash("error", "Thêm quyền thất bại!");
    console.log("error create role: ", error);
  }
};
