const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    //set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try again later",
  };

  if(err.statusCode === StatusCodes.UNAUTHORIZED && err.message === 'Authentication invalid')
  {
    return res.redirect(StatusCodes.MOVED_TEMPORARILY, req.baseUrl + '/login');
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
