const md5 = require("md5");
const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");

module.exports.login = async (req, res) => {
  res.render("admin/pages/auth/login.pug", {
    pageTitle: "Đăng nhập",
  });
};
