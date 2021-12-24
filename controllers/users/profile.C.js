const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../../errors");
const { StatusCodes } = require("http-status-codes");
const User = require("../../models/User.M");

//Moi xu li patient voi manager, admin k biet lam sao
const getInformation = async (req, res) => {
  /*
  const { id, type } = req.user;

  const result = await User.getInformation(id, type);

  if (!result) {
    throw new NotFoundError("Something wrong, please try again!");
  }
  //need adjust, not send all attributes back
 */
  res.render('user/profile',{
    user: "okay",
    userFullname: "Lâm Xương Đức",
    userDoB: "22/07/2000",
    userPhoneNumber: "0123458755",
    userAddress: "dasdasd/adasd ",
  }

  )

  // res.json({ result });
};

const updateInformation = async (req, res) => {
  const { id, type } = req.user;

  res.send("Tu tu roi lam tiep");
};

module.exports = {
  getInformation,
};
