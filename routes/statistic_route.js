const express = require("express");
const router = express.Router();

const {
  getProductConsumption,
  getPackSellQuantity
} = require("../controllers/statistic/statistic.C");

router.route("/product-consumption").get(getProductConsumption);
router.route("/pack-sell").get(getPackSellQuantity);

module.exports = router;