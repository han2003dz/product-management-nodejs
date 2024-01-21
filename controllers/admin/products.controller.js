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
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

module.exports.editRecordPatch = async (req, res) => {
  console.log(req.body);
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  try {
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
