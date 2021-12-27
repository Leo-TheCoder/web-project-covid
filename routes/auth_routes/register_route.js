const express = require('express');
const router = express.Router();

const {register} = require('../../controllers/auth/register.C');

router.route('/').post(register);

module.exports = router;