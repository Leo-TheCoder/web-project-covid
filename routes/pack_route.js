const express = require("express");
const router = express.Router();

const {
  getProductPacks,
  getProductPackById,
} = require("../controllers/product/product-pack.C");

router.route("/").get(getProductPacks);
router.route("/:packId").get(getProductPackById);

module.exports = router;
