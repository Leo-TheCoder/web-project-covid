const express = require("express");
const router = express.Router();

const {
  getPatients,
  getPatientById,
  deletePatientById,
  getAddPatientPage,
  updatePatientPage,
} = require("../controllers/users/patients.C");

router.route("/").get(getPatients);
router.route("/addnewpatient").get(getAddPatientPage);
router
  .route("/:patientId")
  .get(getPatientById)
  .delete(deletePatientById)
  .put(updatePatientPage);

module.exports = router;
