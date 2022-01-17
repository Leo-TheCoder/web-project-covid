const express = require("express");
const router = express.Router();

const {
  getAllManagers,
  getAreas,
  addManager,
  lockAndUnlockManager,
  addManagerPage,
  addAreaPage,
  getDistrictsByCountryId,
  getWardsByCountryId,
  addQuarantineArea
} = require("../controllers/users/admin.C");

router.route("/managers").get(getAllManagers).post(addManager);
router.route("/managers/add").get(addManagerPage);
router.route("/managers/:managerid").post(lockAndUnlockManager);
router.route("/areas").get(getAreas);
router.route("/areas/districts").get(getDistrictsByCountryId);
router.route("/areas/wards").get(getWardsByCountryId);
router.route("/areas/add").get(addAreaPage).post(addQuarantineArea);

module.exports = router;
