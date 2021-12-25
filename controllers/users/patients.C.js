const { StatusCodes } = require("http-status-codes");
const Patient = require("../../models/Patient.M");

const getPatients = async (req, res) => {
  const managerid = req.managerid;

  const result = await Patient.getAllPatients(managerid);
  
  res.status(StatusCodes.OK).render("patients/patients", {
    patients: result,
  });
};

module.exports = {
  getPatients,
};
