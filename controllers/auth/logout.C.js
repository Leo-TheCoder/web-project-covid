const { BadRequestError, UnauthenticatedError } = require('../../errors');
const { StatusCodes } = require('http-status-codes');
const User = require('../../models/User.M');
//declaring public variables

const logout = (req, res) => {
	console.log('log');
	res.cookie('authorization', 'off', { expire: "Wed, 22 Dec 1900 14:42:15 GMT" });
	// res.clearCookie('authorization');
	res.redirect('/');
}

module.exports = {
	logout,
};
