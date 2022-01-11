const express = require("express");
const router = express.Router();

const {
  getPatientOrders,
  getOrderDetail,
} = require("../controllers/product/order.C");

router.route("/").get(getPatientOrders);
router.route("/:orderId").get(getOrderDetail);

module.exports = router;
