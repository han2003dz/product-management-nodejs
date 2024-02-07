const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCloudinary.middleware");

const controller = require("../../controllers/admin/account.controller");

router.get("/", controller.index);
router.get("/create", controller.create);
router.post(
  "/create",
  upload.single("avatar"),
  uploadCloud.upload,
  controller.createPost
);
module.exports = router;
