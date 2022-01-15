const express = require("express");
const router = express.Router();

const { getAllManagers, getAreas } = require("../controllers/users/admin.C");

router.route("/managers").get(getAllManagers);
router.route("/areas").get(getAreas);

module.exports = router;
