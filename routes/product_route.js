const express = require("express");
const router = express.Router();

const {
  getProducts,
  insertProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  addProduct,
} = require("../controllers/product/product.C");

router.route("/").get(getProducts).post(insertProduct);
router.route("/add").get(addProduct);
router
  .route("/:productId")
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;
