const { StatusCodes } = require('http-status-codes');
const User = require('../../models/User.M');
//declaring public variables

const getAdminPage = (req, res) => {
	try {
		res.render('dashboard/admin', {
			css: () => 'css',
			fonts: () => 'fonts',
			navbar: () => 'navbar',
			footer: () => 'footer',
			scripts: () => 'scripts',
		});
	} catch (e) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: e.message });
	}
};

const getManagerPage = (req, res) => {
	try {
		res.render('dashboard/manager', {
			css: () => 'css',
			fonts: () => 'fonts',
			navbar: () => 'navbar',
			footer: () => 'footer',
			scripts: () => 'scripts',
		});
	} catch (e) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: e.message });
	}
};

const getUserPage = (req, res) => {
	try {
		res.render('dashboard/user', {
			css: () => 'css',
			fonts: () => 'fonts',
			navbar: () => 'navbar',
			footer: () => 'footer',
			scripts: () => 'scripts',
		});
	} catch (e) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: e.message });
	}
};

module.exports = {
	getAdminPage,
	getManagerPage,
	getUserPage,
};
