const express = require('express');
const router = express.Router();

const {getLoginPage, login, register} = require('../../controllers/auth/login.C');

router.route('/').get(getLoginPage).post(login);

module.exports = router;