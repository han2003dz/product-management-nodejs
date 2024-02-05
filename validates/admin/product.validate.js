const { check, validationResult } = require("express-validator");

module.exports.createPost = [
  check("title").notEmpty().withMessage("Bạn cần nhập tên cho sản phẩm"),
  check("price")
    .isFloat({ gt: 0 })
    .withMessage("Bạn cần nhập giá sản phẩm và giá phải lớn hơn 0"),
];
