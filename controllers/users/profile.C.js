const { NotFoundError } = require("../../errors");
const { StatusCodes } = require("http-status-codes");
const User = require("../../models/User.M");

//Get information of patient and manager
const getInformation = async (req, res) => {
  const { id, type } = req.user;

  const result = await User.getInformation(id, type);

  if (!result) {
    throw new NotFoundError("Something wrong, please try again!");
  }

  //need adjust, not send all attributes back
  res.json({ result });
};

const updateInformation = async (req, res) => {
  const { id, type } = req.user;

  res.send("Tu tu roi lam tiep");
};

module.exports = {
  getInformation,
};
