const express = require('express');
const router = express.Router();

const {getArea} = require('../controllers/quarantine_area/area.C');


router.route('/').get(getArea);

module.exports = router;