const Account = require("../../models/account.model");

module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };
  const accounts = await Account.find(find);
  res.render("admin/pages/accounts/index.pug", {
    pageTitle: "Quản lý tài khoản",
    accounts,
  });
};

module.exports.create = async (req, res) => {
  res.render("admin/pages/accounts/create", {
    pageTitle: "Thêm tài khoản mới",
  });
};

module.exports.createPost = async (req, res) => {
  res.send("OK");
};
