const Categories = require("../../models/category.model");
const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const sortOptions = require("../../helpers/sort");

module.exports.index = async (req, res) => {
  try {
    const filterStatus = filterStatusHelper(req.query);
    const objectSearch = searchHelper(req.query);
    const find = {
      deleted: false,
      ...(req.query.status && { status: req.query.status }),
      ...(objectSearch.regex && { title: objectSearch.regex }),
    };
    // pagination
    const totalRecord = await Categories.countDocuments(find);
    let objectPagination = paginationHelper(
      {
        currentPage: 1,
        limitItem: 5,
      },
      req.query,
      totalRecord
    );
    //end pagination

    // sort
    const sort = sortOptions(req);
    // end sort

    const categories = await Categories.find(find)
      .limit(objectPagination.limitItem)
      .skip(objectPagination.skip)
      .sort(sort);
    res.render("admin/pages/categories/index.pug", {
      pageTitle: "Danh sách danh mục",
      categories,
      filterStatus,
      keyword: objectSearch.keyword,
      pagination: objectPagination,
    });
  } catch (error) {
    req.flash("error", "Không thể truy cập!");
    console.log("error: ", error);
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
  }
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
    req.flash("success", "Thêm thành công danh mục mới!");
  } catch (error) {
    res.flash("error", "Thêm mới danh mục thất bại!");
    console.log("error create category: ", error);
  } finally {
    res.redirect(`${systemConfig.prefixAdmin}/categories`);
  }
};

module.exports.detailRecord = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const categories = await Categories.findOne(find);
    res.render("admin/pages/categories/detail", {
      pageTitle: categories.title,
      categories: categories,
    });
  } catch (error) {
    console.log("error detail: ", error);
    res.flash("error detail category", "Không thể xem chi tiết danh mục này!");
  }
};

module.exports.deleteRecord = async (req, res) => {
  try {
    const id = req.params.id;
    await Categories.updateOne(
      {
        _id: id,
      },
      {
        deleted: true,
      },
      {
        deletedAt: new Date(),
      }
    );
    req.flash("success", "Xóa thành công danh mục");
  } catch (error) {
    req.flash("error", "Xóa thất bại danh mục sản phẩm!");
  } finally {
    res.redirect("back");
  }
};

module.exports.editRecord = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await Categories.findOne({ _id: id, deleted: false });
    res.render("admin/pages/categories/edit.pug", {
      pageTitle: "Chỉnh sửa danh mục",
      category,
    });
  } catch (error) {
    req.flash("error", "Không tồn tại danh mục này!");
    console.log("error edit category: ", error);
    res.redirect(`${systemConfig.prefixAdmin}/categories`);
  }
};

module.exports.editRecordPatch = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedBy = {
      // account_id: res.locals.user.id,
      updatedAt: new Date(),
    };
    await Categories.updateOne(
      { _id: id },
      { ...req.body, $push: { updatedBy: updatedBy } }
    );
    req.flash("success", "Cập nhật thành công!");
  } catch (error) {
    req.flash("error", "Cập nhật thất bại");
    console.log("error edit category: ", error);
  } finally {
    res.redirect(`${systemConfig.prefixAdmin}/categories`);
  }
};

module.exports.changeStatus = async (req, res) => {
  try {
    const { id, status } = req.params;
    await Categories.updateOne(
      { _id: id },
      {
        status: status,
      }
    );
    req.flash("success", "Cập nhật trạng thái thành công!");
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái:", error);
    req.flash("error", "Cập nhật trạng thái không thành công!");
  } finally {
    res.redirect("back");
  }
};

module.exports.changeMulti = async (req, res) => {
  try {
    const type = req.body.type;
    const ids = req.body.ids.split(",");
    const updatedBy = {
      updatedAt: new Date(),
    };
    switch (type) {
      case "active":
        await Categories.updateMany(
          { _id: { $in: ids } },
          {
            status: "active",
            $push: { updatedBy: updatedBy },
          }
        );
        req.flash(
          "success",
          `Cập nhật thành công trạng thái hoạt động của ${ids.length} danh mục.`
        );
        break;
      case "inactive":
        await Categories.updateMany(
          { _id: { $in: ids } },
          {
            status: "inactive",
            $push: { updatedBy: updatedBy },
          }
        );
        req.flash(
          "success",
          `Cập nhật thành công trạng thái dừng hoạt động của ${ids.length} danh mục.`
        );
        break;
      case "deleted-all":
        await Categories.updateMany(
          { _id: { $in: ids } },
          {
            deleted: true,
            deletedBy: {
              account_id: res.locals.user.id,
              deletedAt: new Date(),
            },
          }
        );
        req.flash("success", `Đã xóa thành công ${ids.length} danh mục.`);
        break;
      default:
        break;
    }
  } catch (error) {
    req.flash("error", "Chưa thể thực hiện được nhiều thay đổi!");
    console.log("error change multi: ", error);
  } finally {
    res.redirect("back");
  }
};
