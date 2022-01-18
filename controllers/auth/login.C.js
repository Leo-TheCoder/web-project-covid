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
			user  : false,
			error : '',
		});
	} catch (e) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: e.message });
	}
};

const login = async (req, res) => {
	const { phone_number, password } = req.body;

	if (!phone_number || !password) {
		return res.render('user/login', {
			user  : false,
			error : 'Bạn nhập thiếu thông tin rồi!',
		});
	}

	const user = await User.getUser(phone_number);
	if (user.first_login == 1) {
		return res.redirect('/login/resetpassword');
	}
	if (!user) {
		return res.render('user/login', {
			user  : false,
			error : 'Nhập sai thông tin!',
		});
	}

	//checking password
	const isPasswordCorrect = await user.comparePassword(password);
	if (!isPasswordCorrect) {
		return res.render('user/login', {
			user  : false,
			error : 'Sai mật khẩu goỳ',
		});
	}

	const token = await user.createJWT();
	res.cookie('authorization', token, { httpOnly: true, expire: 'session' });
	// res.status(StatusCodes.OK).json({ user, token });
	res.redirect('/dashboard');
};

//just for testing
const register = async (req, res) => {
	const { phone_number, password } = req.body;
	const user = await User.InitUser(phone_number, password);
	res.json({ user });
};
const getResetPasswordPage = async (req, res) => {
	res.send('Trang reset password');
};
const resetPassword = async (req, res) => {
	//SĐT
	//Pass mới + Xác nhận
	//Dashboard
	const { phone_number, new_pass, confirm_pass } = req.body;
	if (new_pass !== confirm_pass) {
		return res.send('Confirm password and password are conflicted');
	}
	else {
		const user = await User.InitUser(phone_number, new_pass);
		user.first_login = 0;
		console.log(user);
		User.updatePassword(user.phonenumber, user.password);

		res.redirect('/');
	}
};

module.exports = {
	getHomePage,
	getLoginPage,
	login,
	register,
	getResetPasswordPage,
	resetPassword,
};
