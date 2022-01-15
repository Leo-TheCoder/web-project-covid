const { StatusCodes } = require("http-status-codes");
const User = require("../../models/User.M");
const Area = require("../../models/Area.M");

const getAllManagers = async (req, res) => {
  const { name } = req.query;
  let result;
  if (!name) {
    result = await User.getAllManagers();
  }
  else{
      result = await User.searchManagerByName(name);
  }

  if(!result)
  {
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
}

module.exports = {
  getAllManagers,
  getAreas,
};
