const Product = require("../../models/products.model");
const Category = require("../../models/category.model");
const productHelper = require("../../helpers/priceNew");
const categoryHelper = require("../../helpers/treeCategory");
module.exports.index = async (req, res) => {
  try {
    const listProduct = await Product.find({
      deleted: false,
      status: "active",
    });
    const newProducts = productHelper.priceNewProducts(listProduct);
    res.render("client/pages/products/index.pug", {
      pageTitle: "Trang sản phẩm",
      products: newProducts,
    });
  } catch (error) {
    console.log("error: ", error);
  }
};

module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slugProduct,
      status: "active",
    };
    const product = await Product.findOne(find);
    if (product.product_category_id) {
      const category = await Category.findOne({
        _id: product.product_category_id,
        status: "active",
        deleted: false,
      });
      product.category = category;
    }
    product.priceNew = productHelper.priceNewProduct(product);
    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect(`/products`);
    console.log("error: ", error);
  }
};

module.exports.category = async (req, res) => {
  const find = {
    slug: req.params.slugCategory,
    status: "active",
    deleted: false,
  };
  const category = await Category.findOne(find);
  // lấy ra 1 list category con trong category cha
  const listSubCategory = categoryHelper.tree(category.id);
  // lấy ra id của từng con
  const listSubCategoryId = listSubCategory.map((item) => item.id);

  const products = await Product.find({
    // lấy ra id trong mảng id
    product_category_id: { $in: [category.id, ...listSubCategoryId] },
    deleted: false,
  });

  const newProducts = productHelper.priceNewProducts(products);

  res.render("client/pages/products/index", {
    pageTitle: category.title,
    products: newProducts,
  });
};
