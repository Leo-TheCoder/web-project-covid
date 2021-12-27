const express = require('express');
const router = express.Router();

const {getInformation} = require('../controllers/users/profile.C');

router.route('/').get(getInformation);

module.exports = router;