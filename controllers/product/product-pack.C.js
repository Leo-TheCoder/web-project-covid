/** @format */

const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../errors");
const ProductPack = require("../../models/ProductPack.M");

const getProductPacks = async (req, res) => {
	const { name, sortby } = req.query;
	let result;
	if (name) {
		result = await ProductPack.searchPackByName(name, sortby);
	} else {
		result = await ProductPack.getPacks(sortby);
	}
	res.status(StatusCodes.OK).render("products/packs", {
		packs: result,
		user: true,
	});
};

const getProductPackById = async (req, res) => {
	const { packId } = req.params;
	const result = await ProductPack.getPackDetailById(packId);
	console.log(result);
	res.status(StatusCodes.OK).render("products/packdetail", {
		pack: result,
		user: true,
	});
};

const addProductPack = async (req, res) => {
	const { productpackname, productpacklimit, timeunit, details } = req.body;

	const result = await ProductPack.addPack(
		{ productpackname, productpacklimit, timeunit },
		details
	);

	if (result) {
		return res.status(StatusCodes.OK).redirect("/packs");
	}

	throw new CustomError("Something wrong in controller insert product pack");
};

const updateProductPack = async (req, res) => {
	const { packId } = req.params;
	const { productpackname, productpacklimit, timeunit, details } = req.body;

	const result = await ProductPack.updatePack(
		{ productpacklimit, timeunit },
		details,
		packId
	);

	if (result) {
		return res.status(StatusCodes.OK).redirect("/packs");
	}

	throw new CustomError("Something wrong in controller update product pack");
};

const deleteProductPack = async (req, res) => {
	const { packId } = req.params;

	const result = await ProductPack.deletePack(packId);

	if (result) {
		return res.status(StatusCodes.OK).redirect("/packs");
	}

	throw new CustomError("Something wrong in controller delete product pack");
};

module.exports = {
	getProductPacks,
	getProductPackById,
	addProductPack,
	updateProductPack,
	deleteProductPack,
};
