const express = require("express");
const router = express.Router();

const {
  getArea,
  addQuarantineArea,
  getAreaById,
  updateQuarantineArea,
  deleteQuarantineArea,
  addAreaPage,
} = require("../controllers/quarantine_area/area.C");

router.route("/").get(getArea).post(addQuarantineArea);
router.route("/add").get(addAreaPage);
router
  .route("/:areaid")
  .get(getAreaById)
  .put(updateQuarantineArea)
  .delete(deleteQuarantineArea);

module.exports = router;
