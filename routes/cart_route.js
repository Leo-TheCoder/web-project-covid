const express = require("express");
const router = express.Router();

const {
  getItemsInCart,
  addToCart,
  getItemById,
  updateItemQuantityInCart,
  deletePackInCart,
} = require("../controllers/product/cart.C");

router.route("/").get(getItemsInCart).post(addToCart);
//router.route("/add").get(addProduct);
router.route("/:packid").delete(deletePackInCart);

module.exports = router;
