const { StatusCodes } = require('http-status-codes');
//declaring public variables

const getDashboard = (req, res) => {
	const type = req.user.type;
	switch (type) {
		case 'A':
			//return admin dashboard
			return res.redirect('/admin/managers');
		case 'M':
			//return manager dashboard
			return getManagerPage(req, res);
		case 'P': //patient
			//return user dashboard
			return getUserPage(req, res);
	}
};

const getAdminPage = (req, res) => {
	try {
		res.render('dashboard/admin', {
			user: "okay",
		});
	} catch (e) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: e.message });
	}
};

const getManagerPage = (req, res) => {
	try {
		res.render('dashboard/manager', {
			user: "okay",
		});
	} catch (e) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: e.message });
	}
};

const getUserPage = (req, res) => {
	try {
		res.render('dashboard/user', {
			user: "okay",
		});
	} catch (e) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: e.message });
	}
};

module.exports = {
	getAdminPage,
	getManagerPage,
	getUserPage,
	getDashboard,
};
