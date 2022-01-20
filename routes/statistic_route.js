const express = require("express");
const router = express.Router();

const {
  getProductConsumption,
  getPackSellQuantity,
  getPatientOverTime,
  getPatientOverDay,
  getPatientOverYear
} = require("../controllers/statistic/statistic.C");

router.route("/product-consumption").get(getProductConsumption);
router.route("/pack-sell").get(getPackSellQuantity);
router.route("/patients").get(getPatientOverTime);
router.route("/patients-day").get(getPatientOverDay);
router.route("/patients-year").get(getPatientOverYear);

module.exports = router;