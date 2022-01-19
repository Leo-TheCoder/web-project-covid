const { StatusCodes } = require("http-status-codes");
const Statistic = require("../../models/Statistic.M");
const { CustomError } = require("../../errors");
const Utility = require("../../utilities");

const getProductConsumption = async (req, res) => {

  let result;
  result = await Statistic.getProductConsumption();
  console.log(result);
  if (!result) {
    return res.status(StatusCodes.OK).send("No data");
  }

  return res.status(StatusCodes.OK).json(result);
};

const getPackSellQuantity = async (req, res) => {
  let result;
  result = await Statistic.getPackSellQuantity();
  console.log(result);
  if (!result) {
    return res.status(StatusCodes.OK).send("No data");
  }

  return res.status(StatusCodes.OK).json(result);
};


module.exports = {
  getProductConsumption,
  getPackSellQuantity
};
