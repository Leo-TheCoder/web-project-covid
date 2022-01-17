const Area = require("../../models/Area.M");
const { CustomError, NotFoundError } = require("../../errors");
const { StatusCodes } = require("http-status-codes");

const getArea = async (req, res) => {
  const result = await Area.getAreas();

  if (!result) {
    throw new CustomError("Something wrong when getting areas!");
  }
  res.status(StatusCodes.OK).render("areas/areas", {
    areas: result,
    user: true,
  });
};

const addAreaPage = async (req, res) => {
  const result = await Area.getWard();

  if (!result) {
    throw new CustomError("Something wrong when getting areas!");
  }
  res.status(StatusCodes.OK).render("areas/addarea", {
    ward: result,
  });
}

const getDistrictsByCountryId = async (req, res) => {
  const { countryid } = req.params;
  const result = await Area.getDistrict(countryid);

  if (!result) {
    throw new CustomError("Something wrong when getting areas!");
  }
  res.status(StatusCodes.OK).json(result);
}

const getAreaById = async (req, res) => {
  const { areaid } = req.params;

  const result = await Area.getAreaById(areaid);

  if (!result) {
    throw new NotFoundError("Not found this areaid");
  }

  res.status(StatusCodes.OK).json(result);
};

const addQuarantineArea = async (req, res) => {
  const result = await Area.insertArea(req.body);
  if (!result) {
    throw new CustomError("Something wrong adding new area");
  }

  res.status(StatusCodes.OK).json({
    msg: "Insert successfully!",
    status: "Success",
  });
};

const updateQuarantineArea = async (req, res) => {
  const { areaid } = req.params;

  const result = await Area.updateArea(req.body, areaid);

  if (!result) {
    throw new CustomError("Something wrong update area");
  }

  res.status(StatusCodes.OK).json({
    msg: "Update successfully!",
    status: "Success",
  });
};

const deleteQuarantineArea = async (req, res) => {
  const { areaid } = req.params;

  const result = await Area.deleteArea(areaid);

  if (!result) {
    throw new CustomError("Something wrond delete area");
  }

  res.status(StatusCodes.OK).json({
    msg: "Delete successfully!",
    status: "Success",
  });
};

module.exports = {
  getArea,
  getAreaById,
  addQuarantineArea,
  addAreaPage,
  deleteQuarantineArea,
  updateQuarantineArea,
  getDistrictsByCountryId
};
