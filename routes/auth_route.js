const express = require('express');
const router = express.Router();

const {getLoginPage, login} = require('../controllers/users/login.C');

router.route('/').get(getLoginPage).post(login);

module.exports = router;