const express = require('express');
const router = express.Router();

const {getInformation, updateInformation, editInformation} = require('../controllers/users/profile.C');

router.route('/').get(getInformation).put(updateInformation);
router.route('/edit').get(editInformation);

module.exports = router;