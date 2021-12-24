const express = require('express');
const router = express.Router();

const {getPatients} = require('../controllers/users/patients.C');

router.route('/').get(getPatients);

module.exports = router;