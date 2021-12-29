const express = require('express');
const router = express.Router();

const {getPatients, getPatientById, deletePatientById} = require('../controllers/users/patients.C');

router.route('/').get(getPatients);
router.route('/:patientId').get(getPatientById).delete(deletePatientById);

module.exports = router;