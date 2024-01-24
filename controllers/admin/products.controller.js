const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const priceNew = require("../../helpers/priceNew");
const sortOptions = require("../../helpers/sort");

const Product = require("../../models/products.model");
const systemConfig = require("../../config/system");
module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query);
  const objectSearch = searchHelper(req.query);

  const find = {
    deleted: false,
    ...(req.query.status && { status: req.query.status }),
    ...(objectSearch.regex && { title: objectSearch.regex }),
  };

  // pagination
  const totalRecord = await Product.countDocuments(find);
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

  const products = await Product.find(find)
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip)
    .sort(sort);
  res.render("admin/pages/products/index.pug", {
    pageTitle: "Danh sách sản phẩm",
    products,
    filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

module.exports.changeStatus = async (req, res) => {
  try {
    const status = req.params.status;
    const id = req.params.id;
    await Product.updateOne({ _id: id }, { status: status });
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
        await Product.updateMany(
          { _id: { $in: ids } },
          {
            status: "active",
            $push: { updatedBy: updatedBy },
          }
        );
        req.flash(
          "success",
          `Cập nhật thành công trạng thái hoạt động của ${ids.length} sản phẩm!`
        );
        break;
      case "inactive":
        await Product.updateMany(
          { _id: { $in: ids } },
          {
            status: "inactive",
            $push: { updatedBy: updatedBy },
          }
        );
        req.flash(
          "success",
          `Cập nhật thành công trạng thái dừng hoạt động của ${ids.length} sản phẩm!`
        );
        break;
      case "deleted-all":
        await Product.updateMany(
          { _id: { $in: ids } },
          {
            deleted: true,
            deletedBy: {
              account_id: res.locals.user.id,
              deletedAt: new Date(),
            },
          }
        );
        req.flash("success", `Đã xóa thành công ${ids.length} sản phẩm!`);
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

module.exports.deleteRecord = async (req, res) => {
  try {
    const id = req.params.id;
    await Product.updateOne(
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
    req.flash("success", "Xóa thành công sản phẩm.");
  } catch (error) {
    req.flash("error", "Xóa thất bại!");
  } finally {
    res.redirect("back");
  }
};

module.exports.editRecord = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findOne({ _id: id, deleted: false });
    res.render("admin/pages/products/edit.pug", {
      pageTitle: "Chỉnh sửa sản phẩm",
      product,
    });
  } catch (error) {
    res.flash("error", "Không tồn tại sản phẩm này!");
    console.log("error edit: ", error);
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

module.exports.editRecordPatch = async (req, res) => {
  try {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    const updatedBy = {
      // account_id: res.locals.user.id,
      updatedAt: new Date(),
    };
    await Product.updateOne(
      {
        _id: req.params.id,
      },
      { ...req.body, $push: { updatedBy: updatedBy } }
    );
    req.flash("success", "Cập nhật thành công");
  } catch (error) {
    req.flash("error", "Cập nhật thất bại");
    console.log(error);
  }
  res.redirect(`${systemConfig.prefixAdmin}/products`);
};

module.exports.createRecord = async (req, res) => {
  try {
    res.render("admin/pages/products/create.pug", {
      pageTitle: "Thêm sản phẩm",
    });
  } catch (error) {
    res.flash("error", "Bạn không có quyền tạo phẩm mới!");
    console.log(error);
  }
};

module.exports.createRecordPost = async (req, res) => {
  try {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    const product = new Product(req.body);
    await product.save();
    req.flash("success", "Thêm thành công sản phẩm mới!");
  } catch (error) {
    console.log("error: ", error);
    req.flash("error", "Không thêm được sản phẩm mới!");
  }
  res.redirect(`${systemConfig.prefixAdmin}/products`);
};

module.exports.detailRecord = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const product = await Product.findOne(find);
    product.priceNew = priceNew.priceNewProduct(product);
    res.render("admin/pages/products/detail", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    console.log("error detail: ", error);
    res.flash("error", "Không thể xem chi tiết sản phẩm này!");
  }
};
