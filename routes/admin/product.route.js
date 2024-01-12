const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/products.controller");

router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.delete("/delete/:id", controller.deleteRecord);

router.get("/edit/:id", controller.editRecord);
router.patch("/edit/:id", controller.editRecordPatch);

module.exports = router;
