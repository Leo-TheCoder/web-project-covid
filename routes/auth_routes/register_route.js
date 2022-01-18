const express = require('express');
const router = express.Router();

const {register, getRegisterPage} = require('../../controllers/auth/register.C');

router.route('/').get(getRegisterPage).post(register);

module.exports = router;