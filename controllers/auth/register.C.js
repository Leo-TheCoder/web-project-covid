const { BadRequestError, UnauthenticatedError } = require('../../errors');
const { StatusCodes } = require('http-status-codes');
const User = require('../../models/User.M');

//just for testing
const register = async (req, res) => {
	const {phone_number, password} = req.body;

	const user = await User.InitUser(phone_number, password);
	const result = await User.createAdminAccount(user.phonenumber, user.password);
	
	user.id = result;
	user.type = 'A';
	user.status = 1;
	user.first_login = 0;

	const token = await user.createJWT();
	res.cookie('authorization', token, { httpOnly: true, expire: 'session' });
	res.redirect('/dashboard');
}

const getRegisterPage = async(req, res) => {
	res.render('user/register', {
		
	});
}

module.exports = {
	register,
	getRegisterPage
};
