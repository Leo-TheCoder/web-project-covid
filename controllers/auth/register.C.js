const { BadRequestError, UnauthenticatedError } = require('../../errors');
const { StatusCodes } = require('http-status-codes');
const User = require('../../models/User.M');

//just for testing
const register = async (req, res) => {
	const { phone_number, password } = req.body;
	const user = User.InitUser(phone_number, password);
	res.json({ user });
}

module.exports = {
	register,
};
