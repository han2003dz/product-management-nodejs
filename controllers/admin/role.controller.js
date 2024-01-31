const Role = require("../../models/role.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");

module.exports.index = async (req, res) => {
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
};
