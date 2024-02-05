const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCloudinary.middleware");

const controller = require("../../controllers/admin/products.controller");
const { validationResult } = require("express-validator");
const { createPost } = require("../../validates/admin/product.validate");

router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.deleteRecord);

router.get("/edit/:id", controller.editRecord);
router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.upload,

  controller.editRecordPatch
);

router.get("/create", controller.createRecord);
router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  createPost,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // req.flash("errors", errors.array());
      console.log(errors.errors);
      res.render("admin/pages/products/create", { errors: errors });
    } else {
      next();
    }
  },
  controller.createRecordPost
);

router.get("/detail/:id", controller.detailRecord);

module.exports = router;
