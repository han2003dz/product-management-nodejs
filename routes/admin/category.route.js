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

router.delete("/delete/:id", controller.deleteRecord);

router.get("/edit/:id", controller.editRecord);
router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.upload,
  controller.editRecordPatch
);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

module.exports = router;
