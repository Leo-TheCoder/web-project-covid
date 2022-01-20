const express = require('express');
const router = express.Router();

const {
	getLoginPage,
	login,
	register,
	getResetPasswordPage,
	resetPassword,
} = require('../../controllers/auth/login.C');

router.route('/').get(getLoginPage).post(login);
router.route('/resetpassword').get(getResetPasswordPage).post(resetPassword);

module.exports = router;
