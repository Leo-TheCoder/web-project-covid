const express = require('express');
const router = express.Router();

const {logout} = require('../../controllers/auth/logout.C');

router.route('/').get(logout);

module.exports = router;