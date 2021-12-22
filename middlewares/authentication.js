const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const auth = async (req, res, next) => {
  // check header
  // const authHeader = req.headers.authorization;
  const cookie = req.headers.cookie;

  if (!cookie) {
    throw new UnauthenticatedError("Authentication invalid");
  }

  const authHeader = cookie.split("=")[1];

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError("Authentication invalid");
  }
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    //attach the user to the job routes
    req.user = { id: payload.id, type: payload.type, token: token };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authencation invalid");
  }
};

module.exports = auth;
