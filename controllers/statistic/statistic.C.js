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

const getPatientOverTime  = async (req,res) => {
  const result = await Statistic.getPatientOverTime();
  // return res.status(StatusCodes.OK).json(result);
  return res.status(StatusCodes.OK).render('statistics/patients', {
    user: true,
    data: result
  })
}

const getPatientOverYear  = async (req,res) => {
  const result = await Statistic.getPatientOverYear();
  // return res.status(StatusCodes.OK).json(result);
  return res.status(StatusCodes.OK).render('statistics/patientsYear', {
    user: true,
    data: result
  })
}

const getPatientOverDay  = async (req,res) => {
  const result = await Statistic.getPatientOverDay();
  // return res.status(StatusCodes.OK).json(result);
  return res.status(StatusCodes.OK).render('statistics/patientsDay', {
    user: true,
    data: result
  })
}

module.exports = {
  getProductConsumption,
  getPackSellQuantity,
  getPatientOverTime,
  getPatientOverYear,
  getPatientOverDay
};
