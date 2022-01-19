const express = require("express");
const router = express.Router();

const {
  getProductPacks,
  getProductPackById,
  updateProductPack,
  deleteProductPack,
  addProductPack,
  getAddPackPage
} = require("../controllers/product/product-pack.C");

router.route("/").get(getProductPacks).post(addProductPack);
router.route("/add").get(getAddPackPage);
router
  .route("/:packId")
  .get(getProductPackById)
  .put(updateProductPack)
  .delete(deleteProductPack);

module.exports = router;
