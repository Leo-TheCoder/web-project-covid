const express = require("express");
const router = express.Router();

const {
  getArea,
  addQuarantineArea,
  getAreaById,
  updateQuarantineArea,
  deleteQuarantineArea,
} = require("../controllers/quarantine_area/area.C");

router.route("/").get(getArea).post(addQuarantineArea);
router
  .route("/:areaid")
  .get(getAreaById)
  .put(updateQuarantineArea)
  .delete(deleteQuarantineArea);

module.exports = router;
