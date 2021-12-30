const express = require("express");
const router = express.Router();

const {
  getPatients,
  getPatientById,
  deletePatientById,
  getAddPatientPage,
  updatePatientPage,
  insertPatient,
} = require("../controllers/users/patients.C");

router.route("/").get(getPatients).post(insertPatient);
router.route("/addnewpatient").get(getAddPatientPage);
router
  .route("/:patientId")
  .get(getPatientById)
  .delete(deletePatientById)
  .put(updatePatientPage);

module.exports = router;
