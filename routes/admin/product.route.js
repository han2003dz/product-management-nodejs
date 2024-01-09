const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/products.controller");

router.get("/", controller.index);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.delete("/delete/:id", controller.deleteRecord);


module.exports = router;
