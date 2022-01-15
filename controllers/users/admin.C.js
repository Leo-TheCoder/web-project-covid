const { StatusCodes } = require("http-status-codes");
const User = require("../../models/User.M");
const Area = require("../../models/Area.M");
const { CustomError } = require("../../errors");

const getAllManagers = async (req, res) => {
  const { name } = req.query;
  let result;
  if (!name) {
    result = await User.getAllManagers();
  } else {
    result = await User.searchManagerByName(name);
  }

  if (!result) {
    return res.status(StatusCodes.OK).send("No data");
  }

  return res.status(StatusCodes.OK).json(result);
};

const getAreas = async (req, res) => {
  const result = await Area.getAreas();

  if (!result) {
    throw new CustomError("Something wrong when getting areas!");
  }

  res.status(StatusCodes.OK).json(result);
};

const addManager = async (req, res) => {
  const result = await User.insertManager(req.body);

  if (!result) {
    throw new CustomError("In controller insert manager");
  }

  res.status(StatusCodes.OK).json({
    msg: "Insert successfully!",
    status: "Success",
  });
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

  if(result) {
      return res.status(StatusCodes.OK).json({
          msg: "Update successfully!",
          status: "Success",
      })
  }
  else {
      throw new CustomError("Something wrong when lock/unlock manager!");
  }
};

module.exports = {
  getAllManagers,
  getAreas,
  addManager,
  lockAndUnlockManager,
};
