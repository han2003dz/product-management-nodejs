const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
// const mongooseDelete = require("mongoose-delete");

const productSchema = new mongoose.Schema(
  {
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
    featured: String,
    position: Number,
    slug: {
      type: String,
      slug: "title",
      unique: true,
    },
    createdBy: {
      account_id: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    deleted: {
      type: Boolean,
      default: false,
      required: true,
    },
    // deletedBy: {
    //   account_id: String,
    //   deletedAt: Date,
    // },
    deletedAt: Date,
    updatedBy: [
      {
        // account_id: String,
        updatedAt: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Add plugin
mongoose.plugin(slug);

// export model
const Product = mongoose.model("Products", productSchema, "products");
module.exports = Product;
