const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: String,
  product_category_id: {
    type: String,
    default: "",
  },
  description: String,
  price: Number,
  discountPercentage: Number,
  stock: Number,
  thumbnail: String,
  status: String,
  position: Number,
  deleted: Boolean,
  deletedAt: Date,
});

const Product = mongoose.model("Products", productSchema, "products");
module.exports = Product;
