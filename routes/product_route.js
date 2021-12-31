const express = require("express");
const router = express.Router();

const {
  getProducts,
  insertProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/product/product.C");

router.route("/").get(getProducts).post(insertProduct);
router
  .route("/:productId")
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;
