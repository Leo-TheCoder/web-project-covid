const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

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

module.exports = auth;
