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

module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const role = await Role.findOne(find);
    res.render("admin/pages/roles/detail", {
      pageTitle: role.title,
      role,
    });
  } catch (error) {
    req.flash("error", "Không thể xem chi tiết quyền này!");
  }
};

module.exports.deleteRole = async (req, res) => {
  try {
    const id = req.params.id;
    await Role.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedAt: new Date(),
      }
    );
    req.flash("success", "Đã xóa thành công!");
    res.redirect("back");
  } catch (error) {
    req.flash("error", "Xóa thất bại!");
    res.redirect("back");
  }
};

module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    let find = {
      _id: id,
      deleted: false,
    };
    const role = await Role.findOne(find);
    res.render("admin/pages/roles/edit", {
      pageTitle: "Sửa quyền",
      role: role,
    });
  } catch (error) {
    res.flash("success", "Không thể truy cập!");
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};

module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    await Role.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhật quyền thành công!");
  } catch (error) {
    req.flash("error", "Cập nhật quyền thất bại!");
  }
  res.redirect(`${systemConfig.prefixAdmin}/roles`);
};
