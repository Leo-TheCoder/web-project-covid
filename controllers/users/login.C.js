const { BadRequestError, UnauthenticatedError } = require('../../errors');
const { StatusCodes } = require('http-status-codes');
const User = require('../../models/User.M');
//declaring public variables

//get login page
const getHomePage = (req, res) => {
	//redirect to login page (temporary)
	res.redirect('/login');
};

const getLoginPage = (req, res) => {
	try {
		res.render('user/login', {
			css     : () => 'css',
			fonts   : () => 'fonts',
			navbar  : () => 'navbar',
			footer  : () => 'footer',
			scripts : () => 'scripts',
		});
	} catch (e) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: e.message });
	}
};

const login = async (req, res) => {
	const { phone_number, password } = req.body;

	if (!phone_number || !password) {
		throw new BadRequestError('Please provide email and password');
	}

	const user = await User.getUser(phone_number);

	if (!user) {
		throw new UnauthenticatedError('Invalid Credentials');
	}

	//checking password
	const isPasswordCorrect = await user.comparePassword(password);
	if (!isPasswordCorrect) {
		throw new UnauthenticatedError('Invalid Credentials');
	}

	const token = user.createJWT();
	//just for testing
	res.status(StatusCodes.OK).json({ user, token });
	res.render('user/login', {
		css     : () => 'css',
		fonts   : () => 'fonts',
		navbar  : () => 'navbar',
		footer  : () => 'footer',
		scripts : () => 'scripts',
	});
};

module.exports = {
	getHomePage,
	getLoginPage,
	login,
};
