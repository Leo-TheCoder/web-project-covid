/** @format */

const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../../errors");
const Patient = require("../../models/Patient.M");

const getPatients = async (req, res) => {
	const managerid = req.managerid;

	const result = await Patient.getAllPatients(managerid);

	if (!result) {
		return res.status(StatusCodes.OK).send("No data");
	}

	res.status(StatusCodes.OK).render("patients/patients", {
		patients: result,
	});
};

const getPatientById = async (req, res) => {
	const { patientId } = req.params;
	const managerid = req.managerid;
	const result = await Patient.getPatientById(patientId, managerid);
	console.log(result);

	if (!result) {
		throw new NotFoundError("Not found this id");
	}

	res.status(StatusCodes.OK).render("patients/edit", {
		patientid: result.patientId,
	});
};

const deletePatientById = async (req, res) => {
	const { patientId } = req.params;
	const managerid = req.managerid;
	const result = await Patient.deletePatientById(patientId, managerid);

	if (!result) {
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.send("Something wrong, can not delete data");
	}

	res.status(StatusCodes.OK).json(result);
};

module.exports = {
	getPatients,
	getPatientById,
	deletePatientById,
};
