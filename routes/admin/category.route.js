const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCloudinary.middleware");

const controller = require("../../controllers/admin/category.controller");

router.get("/", controller.index);

router.get("/create", controller.createRecord);
router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  controller.createRecordPost
);

router.get("/detail/:id", controller.detailRecord);
module.exports = router;
