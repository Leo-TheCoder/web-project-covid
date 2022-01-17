/** @format */

const Utility = require("../../utilities");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, CustomError } = require("../../errors");
const Patient = require("../../models/Patient.M");
const Area = require("../../models/Area.M");

const getPatients = async (req, res) => {
  const managerid = req.managerid;

  const { name, sortby } = req.query;
  let result;
  if (name) {
    result = await Patient.getAllPatientsByName(managerid, name.toLowerCase(), sortby);
  } else {
    result = await Patient.getAllPatients(managerid, sortby);
  }

  if (!result) {
    return res.status(StatusCodes.OK).send("No data");
  }

  //change status '0' -> 'F0'
  for (const patient of result) {
    patient.status = "F" + patient.status;
  }

  return res.status(StatusCodes.OK).render("patients/patients", {
    patients: result,
    user: true,
  });
};

const getPatientById = async (req, res) => {
  const { patientId } = req.params;
  const managerid = req.managerid;

  const getPatient = Patient.getPatientById(patientId, managerid);
  const getAreas = Area.getAreas();

  const [result, quarantinearea] = await Promise.all([getPatient, getAreas]);

  if (!result) {
    throw new NotFoundError("Not found this id");
  }
  
  const quarantineareaid = result.quarantineareaid;
  const obj = quarantinearea.find(({areaid}) => areaid == quarantineareaid);
  obj.area = true;

  result.quarantinearea = quarantinearea;


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

  //Delete successfully
  res.status(StatusCodes.OK).redirect("/patients");
};

const getAddPatientPage = async (req, res) => {
  const quarantinearea = await Area.getAreas();

	res.status(StatusCodes.OK).render("patients/addnew", {
		user: true,
    quarantinearea,
	});
};

const updatePatientPage = async (req, res) => {
  const {patientId} = req.params;

  const result = await Patient.updatePatient(patientId, req.body);
  if (!result) {
    throw new CustomError("Something wrong when updating patient!");
  }

  res.status(StatusCodes.OK).redirect(`/patients/${patientId}`);
};

const insertPatient = async (req, res) => {
  const result = await Patient.insertPatient(req.body, req.managerid);

  if (!result) {
    throw new CustomError("In controller insert patient");
  }

  //Insert succesfully
  res.status(StatusCodes.OK).redirect("/patients");
};

const getContactPatients = async (req, res) => {
  const { patientId } = req.params;
  const managerid = req.managerid;
  const result = await Patient.getContactPatients(patientId, managerid);

  if (!result) {
    return res.status(StatusCodes.OK).send("No data");
  }

  //change status '0' -> 'F0'
  for (const patient of result) {
    patient.status = "F" + patient.status;
    patient.contact_time = Utility.getDDMMYYYYFormat(patient.contact_time);
  }

  return res.status(StatusCodes.OK).render("patients/contact", {
    patients: result,
    user: true,
  });
};

module.exports = {
  getPatients,
  getPatientById,
  deletePatientById,
  getAddPatientPage,
  updatePatientPage,
  insertPatient,
  getContactPatients,
};
