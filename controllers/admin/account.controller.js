const md5 = require("md5");
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");

module.exports.index = async (req, res) => {
  try {
    let find = {
      deleted: false,
    };
    const accounts = await Account.find(find).select("-password -token");
    for (const account of accounts) {
      const role = await Role.findOne({
        _id: account.role_id,
        deleted: false,
      });
      account.role = role;
    }
    res.render("admin/pages/accounts/index.pug", {
      pageTitle: "Quản lý tài khoản",
      accounts,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.create = async (req, res) => {
  try {
    const roles = await Role.find({ deleted: false });
    res.render("admin/pages/accounts/create", {
      pageTitle: "Thêm tài khoản mới",
      roles,
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports.createPost = async (req, res) => {
  try {
    const emailExist = await Account.findOne({
      email: req.body.email,
      deleted: false,
    });

    if (emailExist) {
      req.flash("error", `Email ${req.body.email} đã tồn tại`);
      res.redirect("back");
    } else {
      req.body.password = md5(req.body.password);
      const account = new Account(req.body);
      await account.save();
      res.redirect(`${systemConfig.prefixAdmin}/accounts`);
      req.flash("success", "Tạo thành công tài khoản mới");
    }
  } catch (error) {
    req.flash("error", "Chưa tạo được tài khoản mới");
    res.redirect("back");
    console.log(error);
  }
};
