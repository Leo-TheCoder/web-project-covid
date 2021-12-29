const {
  NotFoundError, BadRequestError,
} = require("../../errors");
const { StatusCodes } = require("http-status-codes");
const User = require("../../models/User.M");
const Utility = require("../../utilities");

//Get information of patient and manager
const getInformation = async (req, res) => {
  const { id, type } = req.user;

  const result = await User.getInformation(id, type);

  if (!result) {
    throw new NotFoundError("Something wrong, please try again!");
  }

  if (type === "P") {
    res.status(StatusCodes.OK).render("user/profile/profile", {
      user: "okay",
      userFullname: result.patientname,
      userDoB: Utility.getDDMMYYYYFormat(result.patientdob),
      userPhoneNumber: result.patientphone,
      userAddress: result.patientaddress,
    });
  } else if (type === "M") {
    res.status(StatusCodes.OK).render("user/profile/profile", {
      user: "okay",
      userFullname: result.managername,
      userDoB: Utility.getDDMMYYYYFormat(result.managerdob),
      userPhoneNumber: result.managerphone,
      userAddress: result.manageraddress,
    });
  }
  else {  //dummy
    res.render("user/profile", {
      user: "okay",
      userFullname: "Who the hell are you",
      userDoB: "xx/xx/xxxx",
      userPhoneNumber: "6666666666",
      userAddress: "666",
    });
  }

  // res.json({ result });
};

const editInformation = async (req, res) => {
  const { id, type } = req.user;

  const result = await User.getInformation(id, type);

  if (!result) {
    throw new NotFoundError("Something wrong, please try again!");
  }

  const dob = result.patientdob;
  let month = dob.getMonth();
  if(++month <= 10) {
    month = '0' + month;
  }
  if (type === "P") {
    res.status(StatusCodes.OK).render("user/profile/editProfile", {
      user: "okay",
      userFullname: result.patientname,
      userDoB: dob.getFullYear() + '-' + month + '-' + dob.getDate(),
      userAddress: result.patientaddress,
    });
  } else if (type === "M") {
    res.status(StatusCodes.OK).render("user/profile/editProfile", {
      user: "okay",
      userFullname: result.managername,
      userDoB: dob.getFullYear() + '-' + month + '-' + dob.getDate(),
      userAddress: result.manageraddress,
    });
  }
  else {  //dummy
    res.render("user/profile/edit", {
      user: "okay",
      userFullname: "Who the hell are you",
      userDoB: "xx/xx/xxxx",
      userAddress: "666",
    });
  }

  // res.json({ result });
};

const updateInformation = async (req, res) => {
  const { id, type } = req.user;
  console.log(req.body);

  const result = await User.updateInformation(id, type, req.body);

  //Not result/ not update/ update one more rows
  if(!result || result < 1 || result > 1)
  {
    throw new BadRequestError("Something wrong, bad request");
  }

  res.status(StatusCodes.OK).json({msg: "Update successfully!"});
};

module.exports = {
  getInformation,
  updateInformation,
  editInformation,
};
