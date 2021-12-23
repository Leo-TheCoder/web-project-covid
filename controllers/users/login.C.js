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
			user: false,
			error: "",
		});
	} catch (e) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: e.message });
	}
};

const login = async (req, res) => {
	const { phone_number, password } = req.body;
	console.log(req.body);

	if (!phone_number || !password) {
		throw new BadRequestError('Please provide phone number and password');
	}

	const user = await User.getUser(phone_number);

	if (!user) {
		throw new UnauthenticatedError('Invalid Credentials');
	}

	//checking password
	const isPasswordCorrect = await user.comparePassword(password);
	if (!isPasswordCorrect) {
		// throw new UnauthenticatedError('Invalid Credentials');
		// res.redirect('/auth/login');
		return res.render('user/login', {
			user: false,
			// css: () => 'css',
			// fonts: () => 'fonts',
			// navbar: () => 'navbar',
			// footer: () => 'footer',
			// scripts: () => 'scripts',
			error: "Sai mật khẩu goỳ",
		});
	}

	const token = user.createJWT();
	//just for testing
	// const cookieValue = 'authorization=Bearer ' + token + '; HttpOnly'
	// res.setHeader('Set-Cookie', cookieValue);
	res.cookie('authorization', token, { httpOnly: true, expire: 'session' });
	// res.status(StatusCodes.OK).json({ user, token });
	res.redirect('/dashboard');
};

//just for testing
const register = async (req, res) => {
	const { phone_number, password } = req.body;
	const user = User.InitUser(phone_number, password);
	res.json({ user });
}

module.exports = {
	getHomePage,
	getLoginPage,
	login,
	register,
};
