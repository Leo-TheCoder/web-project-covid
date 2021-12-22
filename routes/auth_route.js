const express = require('express');
const router = express.Router();

const {getLoginPage, login, register} = require('../controllers/users/login.C');

router.route('/').get(getLoginPage).post(login);
router.route('/register').post(register);

module.exports = router;