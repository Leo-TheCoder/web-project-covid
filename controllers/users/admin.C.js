const { StatusCodes } = require("http-status-codes");
const User = require("../../models/User.M");
const Area = require("../../models/Area.M");
const Audit = require("../../models/Audit.M");
const { CustomError } = require("../../errors");
const Utility = require("../../utilities");

const getAllManagers = async (req, res) => {
  const { name, sortby } = req.query;
  let result;
  if (!name) {
    result = await User.getAllManagers(sortby);
  } else {
    result = await User.searchManagerByName(name, sortby);
  }

  if (!result) {
    return res.status(StatusCodes.OK).send("No data");
  }

  return res.status(StatusCodes.OK).render("dashboard/admin", {
    user: true,
    manager: true,
    array: result,
    editScript: () => "editmanagerscript"
  });
};

const getAreas = async (req, res) => {
  const result = await Area.getAreas();

  if (!result) {
    throw new CustomError("Something wrong when getting areas!");
  }

  res.status(StatusCodes.OK).render("dashboard/admin", {
    user: true,
    manager: false,
    array: result,
    editScript: () => "editmanagerscript"
  });
};

const addAreaPage = async (req, res) => {
  const result = await Area.getCountry();

  if (!result) {
    throw new CustomError("Something wrong when getting areas!");
  }
  res.status(StatusCodes.OK).render("areas/addarea", {
    country: result,
    editScript: () => "editareascript"
  });
}

const getDistrictsByCountryId = async (req, res) => {
  const { countryid } = req.query;
  const result = await Area.getDistrict(countryid);

  if (!result) {
    throw new CustomError("Something wrong when getting areas!");
  }
  res.status(StatusCodes.OK).json(result);
}
const getWardsByCountryId = async (req, res) => {
  const { countryid, districtid } = req.query;
  const result = await Area.getWard(countryid, districtid);

  if (!result) {
    throw new CustomError("Something wrong when getting areas!");
  }
  res.status(StatusCodes.OK).json(result);
}

const addQuarantineArea = async (req, res) => {
  const result = await Area.insertArea(req.body);
  if (!result) {
    throw new CustomError("Something wrong adding new area");
  }

  res.status(StatusCodes.OK).redirect('/admin/areas');
};

const addManagerPage = async (req, res) => {
  const areas = await Area.getAreas();

  res.status(StatusCodes.OK).render("dashboard/addnewmanager", {
    user: true,
    areas: areas,
    editScript: () => "editmanagerscript"
  });
}

const addManager = async (req, res) => {
  const result = await User.insertManager(req.body);

  if (!result) {
    throw new CustomError("In controller insert manager");
  }

  res.status(StatusCodes.OK);
  res.redirect('/admin/managers');
};

const lockAndUnlockManager = async (req, res) => {
  const { managerid } = req.params;
  const { lock } = req.body;
  let result;
  if (lock) {
    result = await User.lockManager(managerid);
  } else {
    result = await User.unlockManager(managerid);
  }

  if (result) {
    return res.status(StatusCodes.OK).json({
      msg: "Update successfully!",
      status: "Success",
    });
  } else {
    throw new CustomError("Something wrong when lock/unlock manager!");
  }
};

const getHistoryActivity = async (req, res) => {
  const {managerid} = req.params;

  const result = await Audit.GetAudit(managerid);
  // res.json(result);
  res.render('dashboard/managerhistory', {
    user: true,
    array: result
  })
}

module.exports = {
  getAllManagers,
  getAreas,
  addManager,
  lockAndUnlockManager,
  addManagerPage,
  addAreaPage,
  getDistrictsByCountryId,
  getWardsByCountryId,
  addQuarantineArea,
  getHistoryActivity,
};
