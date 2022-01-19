const express = require("express");
const router = express.Router();

const {
  getPatientOrders,
  getOrderDetail,
  addOrder,
} = require("../controllers/product/order.C");

router.route("/").get(getPatientOrders).post(addOrder);
router.route("/:orderId").get(getOrderDetail);

module.exports = router;
