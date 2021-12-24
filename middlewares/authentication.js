const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");
const User = require("../models/User.M");

const auth = async (req, res, next) => {
  // check cookie
  const cookie = req.cookies;

  if (!cookie) {
    throw new UnauthenticatedError("Authentication invalid");
  }

  const token = cookie.authorization;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    //attach the user to the job routes
    req.user = { id: payload.id, type: payload.type };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

const authManager = async (req, res, next) => {
  if(req.user.type === 'M')
  {
    const id = await User.getManagerID(req.user.id);
    req.managerid = id;
    next();
  }
  else
  {
    throw new UnauthenticatedError("No privilege");
  }
}


module.exports = {
  auth,
  authManager
};
