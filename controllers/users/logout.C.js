const { BadRequestError, UnauthenticatedError } = require('../../errors');
const { StatusCodes } = require('http-status-codes');
const User = require('../../models/User.M');
//declaring public variables

const logout = (req,res) => {
	res.setHeader('Set-Cookie', 'authorization=Bearer null' + '; Path=/;');
  res.status(StatusCodes.OK).json('hello');
}

module.exports = {
	logout,
};
