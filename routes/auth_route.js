const express = require('express');
const router = express.Router();

const {getLoginPage, login, register} = require('../controllers/users/login.C');
const {logout} = require('../controllers/users/logout.C');

router.route('/logout').get(logout);
router.route('/register').post(register);
router.route('/login').get(getLoginPage).post(login);

module.exports = router;