const express = require("express");
const router = express.Router();

const {
  getItemsInCart,
  addToCart,
  getItemById,
  updateItemQuantityInCart,
  deletePackInCart,
  pay,
  payResult,
} = require("../controllers/product/cart.C");

router.route("/").get(getItemsInCart).post(addToCart);
//router.route("/add").get(addProduct);
router.route("/:cartId").delete(deletePackInCart).post(pay);
router.route("/:cartId/result").post(payResult);

module.exports = router;
