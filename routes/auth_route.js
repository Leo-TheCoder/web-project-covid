const express = require('express');
const router = express.Router();

const {getLoginPage, login, register} = require('../controllers/users/login.C');
const {logout} = require('../controllers/users/logout.C');

router.route('/').get(getLoginPage).post(login);
router.route('/logout').get(logout);
router.route('/register').post(register);

module.exports = router;