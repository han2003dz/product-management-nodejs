const md5 = require("md5");
const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");

module.exports.login = async (req, res) => {
  try {
    if (req.cookies.token) {
      res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    } else {
      res.render("admin/pages/auth/login.pug", {
        pageTitle: "Đăng nhập",
      });
    }
  } catch (error) {
    console.log("error login: ", error);
  }
};

module.exports.loginPost = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Account.findOne({
      email,
      deleted: false,
    });
    if (!user) {
      req.flash("error", "Email không tồn tại!");
      res.redirect("back");
      return;
    }
    if (md5(password) != user.password) {
      req.flash("error", "Sai mật khẩu!");
      res.redirect("back");
      return;
    }
    if (user.status == "inactive") {
      req.flash("error", "Tài khoản đã bị khóa!");
      res.redirect("back");
      return;
    }
    res.cookie("token", user.token);
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    req.flash("success", "Đăng nhập thành công");
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("back");
  }
};

module.exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  } catch (error) {
    console.log("error: ", error);
  }
};
