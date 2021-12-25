const express = require('express');
const router = express.Router();

const {getInformation, updateInformation} = require('../controllers/users/profile.C');

router.route('/').get(getInformation).put(updateInformation);

module.exports = router;