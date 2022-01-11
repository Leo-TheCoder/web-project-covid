const express = require("express");
const router = express.Router();

const {
  getItemsInCart,
  addToCart,
  getItemById,
  updateItemQuantityInCart,
  deleteItemInCart,
} = require("../controllers/product/cart.C");

router.route("/").get(getItemsInCart).post(addToCart);
//router.route("/add").get(addProduct);
router
  .route("/:cartDetailId")
  .get(getItemById)
  .put(updateItemQuantityInCart)
  .delete(deleteItemInCart);

module.exports = router;
