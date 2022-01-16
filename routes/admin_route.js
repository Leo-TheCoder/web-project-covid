const express = require("express");
const router = express.Router();

const {
  getAllManagers,
  getAreas,
  addManager,
  lockAndUnlockManager,
  addManagerPage
} = require("../controllers/users/admin.C");

router.route("/managers").get(getAllManagers).post(addManager);
router.route("/managers/add").get(addManagerPage);
router.route("/managers/:managerid").post(lockAndUnlockManager);
router.route("/areas").get(getAreas);

module.exports = router;
