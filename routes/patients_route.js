const express = require("express");
const router = express.Router();

const {
  getPatients,
  getPatientById,
  deletePatientById,
  getAddPatientPage,
  updatePatientPage,
  insertPatient,
  getContactPatients,
} = require("../controllers/users/patients.C");

router.route("/").get(getPatients).post(insertPatient);
router.route("/addnewpatient").get(getAddPatientPage);
router
  .route("/:patientId")
  .get(getPatientById)
  .delete(deletePatientById)
  .put(updatePatientPage);

router.route("/:patientId/contact").get(getContactPatients);

module.exports = router;
