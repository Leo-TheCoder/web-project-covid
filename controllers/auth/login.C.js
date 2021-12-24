const { BadRequestError, UnauthenticatedError } = require('../../errors');
const { StatusCodes } = require('http-status-codes');
const User = require('../../models/User.M');

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

	if (!phone_number || !password) {
		return res.render('user/login', {
			user: false,
			error: "Bạn nhập thiếu thông tin rồi!",
		});
	}

	const user = await User.getUser(phone_number);

	if (!user) {
		return res.render('user/login', {
			user: false,
			error: "Nhập sai thông tin!",
		});
	}

	//checking password
	const isPasswordCorrect = await user.comparePassword(password);
	if (!isPasswordCorrect) {
		return res.render('user/login', {
			user: false,
			error: "Sai mật khẩu goỳ",
		});
	}

	const token = user.createJWT();
	res.cookie('authorization', token, { httpOnly: true, expire: 'session' });
	// res.status(StatusCodes.OK).json({ user, token });
	res.redirect('/dashboard');
};

//just for testing
const register = async (req, res) => {
	const { phone_number, password } = req.body;
	const user = await User.InitUser(phone_number, password);
	res.json({user});
}

module.exports = {
	getHomePage,
	getLoginPage,
	login,
	register,
};
