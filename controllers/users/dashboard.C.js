const { StatusCodes } = require('http-status-codes');
const ProductPack = require("../../models/ProductPack.M");
const numPreview = 3;
//declaring public variables

const getDashboard = (req, res) => {
	const type = req.user.type;
	switch (type) {
		case 'A':
			//return admin dashboard
			return getAdminPage(req, res);
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

const getUserPage = async (req, res) => {
	try {
		let packsPreview = [];
		for (let i=1; i <= numPreview; i++) {
			const result = await ProductPack.getPackDetailById(i+1);

			packsPreview.push({
				packname: result.productpackname,
				detail: result.products.map(p => p.productname).join(", ")
			});
		}
			
		res.render('dashboard/user', {
			user: "okay",
			packs: packsPreview
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
