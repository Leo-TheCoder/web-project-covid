/** @format */

const Utility = require("../../utilities");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, CustomError } = require("../../errors");
const Patient = require("../../models/Patient.M");

const getPatients = async (req, res) => {
	const managerid = req.managerid;

	const result = await Patient.getAllPatients(managerid);

	if (!result) {
		return res.status(StatusCodes.OK).send("No data");
	}

	//change status '0' -> 'F0'
	for (const patient of result) {
		patient.status = "F" + patient.status;
	}

	res.status(StatusCodes.OK).render("patients/patients", {
		patients: result,
		user: "okay",
	});
};

const getPatientById = async (req, res) => {
	const { patientId } = req.params;
	const managerid = req.managerid;
	const result = await Patient.getPatientById(patientId, managerid);

	if (!result) {
		throw new NotFoundError("Not found this id");
	}

	result.patientdob = Utility.getDDMMYYYYFormat(result.patientdob);
	result.startdate = Utility.getDDMMYYYYFormat(result.startdate);
	result.enddate = Utility.getDDMMYYYYFormat(result.enddate);

	res.status(StatusCodes.OK).render("patients/edit", {
		patient: result,
		editScript: () => "editpatientscript",
		user: "okay",
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

	res.status(StatusCodes.OK).json({
		msg: "Delete successfully!",
		status: "Success",
	});
};

const getAddPatientPage = (req, res) => {
	res.status(StatusCodes.OK).render("patients/addnew", {
		user: "okay",
	});
};

const updatePatientPage = async (req, res) => {
	const result = await Patient.updatePatient(req.body);

	if (!result) {
		throw CustomError("Something wrong when updating patient!");
	}

	res.status(StatusCodes.OK).render("patients/edit", {
		patient: result,
		editScript: () => "editpatientscript",
		user: "okay",
	});
};

const insertPatient = async (req, res) => {
	const result = await Patient.insertPatient(req.body, req.managerid);

	if (!result) {
		throw new CustomError("In controller insert patient");
	}

	res.status(StatusCodes.OK).json({
		msg: "Insert successfully!",
		status: "Success",
	});
};

module.exports = {
	getPatients,
	getPatientById,
	deletePatientById,
	getAddPatientPage,
	updatePatientPage,
	insertPatient,
};
